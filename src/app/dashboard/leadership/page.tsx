import { gitlabClient } from '@/lib/graphql';

interface Milestone {
  title: string;
  startDate: string;
  dueDate: string;
  description: string;
}

async function getMilestones() {
  const query = `
    query {
      project(fullPath: "${process.env.GITLAB_PROJECT_PATH}") {
        milestones(state: opened) {
          nodes {
            title
            startDate
            dueDate
            description
          }
        }
      }
    }
  `;
  
  const data = await gitlabClient.serverRequest<{ project: { milestones: { nodes: Milestone[] } } }>(query);
  return data.project.milestones.nodes;
}

export default async function LeadershipDashboard() {
  const milestones = await getMilestones();
  
  // Sort by startDate to find current and previous
  const sorted = [...milestones].sort((a, b) => 
    new Date(a.startDate || '9999-12-31').getTime() - new Date(b.startDate || '9999-12-31').getTime()
  );
  
  const current = sorted[0];
  const previous = sorted.slice(0, -1).reverse()[0] || null; // Simplistic logic for "previous"

  return (
    <div className="p-8 font-sans">
      <h1 className="text-3xl font-bold mb-8">Leadership Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Current Milestone */}
        <div className="border p-6 rounded-lg bg-blue-50 border-blue-200">
          <h2 className="text-xl font-semibold mb-4 text-blue-800">Current Milestone</h2>
          {current ? (
            <div className="space-y-2">
              <p className="text-2xl font-bold">{current.title}</p>
              <p><strong>Start:</strong> {current.startDate || 'N/A'}</p>
              <p><strong>Due:</strong> {current.dueDate || 'N/A'}</p>
              <p className="text-sm text-gray-600 mt-4">{current.description}</p>
            </div>
          ) : (
            <p>No current opened milestones found.</p>
          )}
        </div>

        {/* Previous Milestone */}
        <div className="border p-6 rounded-lg bg-gray-50 border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Previous Milestone</h2>
          {previous ? (
            <div className="space-y-2">
              <p className="text-2xl font-bold">{previous.title}</p>
              <p><strong>Start:</strong> {previous.startDate || 'N/A'}</p>
              <p><strong>Due:</strong> {previous.dueDate || 'N/A'}</p>
              <p className="text-sm text-gray-600 mt-4">{previous.description}</p>
            </div>
          ) : (
            <p>No previous opened milestones found.</p>
          )}
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">All Opened Milestones</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="text-left p-3 border-r">Title</th>
                <th className="text-left p-3 border-r">Start Date</th>
                <th className="text-left p-3 border-r">Due Date</th>
              </tr>
            </thead>
            <tbody>
              {milestones.map((m, i) => (
                <tr key={i} className="border-b hover:bg-gray-50">
                  <td className="p-3 border-r">{m.title}</td>
                  <td className="p-3 border-r">{m.startDate || 'N/A'}</td>
                  <td className="p-3">{m.dueDate || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
