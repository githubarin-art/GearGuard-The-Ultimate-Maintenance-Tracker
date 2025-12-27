import TaskActivityPanel from '../components/TaskActivityPanel';

const ActivityPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Activity Log</h2>
        <p className="text-gray-600 mt-1">View all system activities and team actions</p>
      </div>

      <TaskActivityPanel />
    </div>
  );
};

export default ActivityPage;
