import { useQuery, gql } from "@apollo/client"
import Link from "next/link"
import { useRouter } from "next/router";
import { useState } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarWeek ,faAngleRight ,faPlus } from '@fortawesome/free-solid-svg-icons';


const GET_TASKS = gql`
  query GetTasks {
    tasks {
      _id
      title
      status
      dueDate
    }
  }
`;

export default function Home() {

  const router = useRouter();
  const { data, loading, error } = useQuery(GET_TASKS);
  const [statusFilter, setStatusFilter] = useState('all');

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg">Loading tasks...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-red-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg border border-red-200">
        <div className="text-red-500 text-center">
          <p className="text-lg font-semibold">Error loading tasks</p>
          <p className="text-sm text-gray-500 mt-2">Please try again later</p>
        </div>
      </div>
    </div>
  );

  const uniqueStatuses = [...new Set(data.tasks.map(task => task.status))];
  
  let filteredTasks;

  if (statusFilter === 'all') {
     filteredTasks = data.tasks;
  } else {
     filteredTasks = data.tasks.filter(task => task.status === statusFilter);
  }


  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 onClick={() => router.reload()} className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2 cursor-pointer">
                Task Manager
              </h1>
              <p className="text-gray-600">Organize and track your tasks efficiently</p>
            </div>
            
            <Link href="/add-task">
              <button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2">
                <FontAwesomeIcon className="w-5 h-5" icon={faPlus} />
                Add Task
              </button>
            </Link>
          </div>
        </div>

        
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <label className="text-gray-700 font-medium">Filter by Status:</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  statusFilter === 'all'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All ({data.tasks.length})
              </button>
              {uniqueStatuses.map(status => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 capitalize ${
                    statusFilter === status
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status} ({data.tasks.filter(task => task.status === status).length})
                </button>
              ))}
            </div>
          </div>
        </div>



        {/* Filetered task === 0 then show 'heve no task' other wise show the task card's */}

        {filteredTasks.length === 0 ? ( 
          <div className="bg-white rounded-xl shadow-lg p-[25px] text-center border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No tasks found</h3>
            <p className="text-gray-500">
                You don't have any tasks yet. Create your first task to get started!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTasks.map(task => (
              <Link key={task._id} href={`/task/${task._id}`}>
                <div className="bg-white rounded-xl shadow-lg hover:shadow-xl border border-gray-100 p-[24px] cursor-pointer transform hover:-translate-y-1 transition-all duration-200 group">
                  <div className="flex items-start justify-between mb-[16px]">
                    <h3 className="text-lg font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors duration-200 line-clamp-2">
                        <span className="capitalize">{task.title}</span>
                    </h3>
                     <FontAwesomeIcon className="text-gray-800 group-hover:text-indigo-600 transition-colors duration-200 " icon={faAngleRight} />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={"px-3 py-1 text-[#5409DA] group-hover:text-gray-600  rounded-full text-xs font-medium border"}>
                        {task.status}
                      </span>
                    </div>
                    
                    <div className="flex items-center text-gray-500">
                      <FontAwesomeIcon  className="w-4 h-4 mr-2" icon={faCalendarWeek} />
                      <span className="text-sm">{formatDate(task.dueDate)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


// WORK FLOW
// typeDefs.js and resolver.js  
// in my resolver.js import mongoBb
// import both typeDefs and resolver.js in graphql.js
// in the api folder ---> graphql.js we import the apollo server

// now we can query each needed query in the component and use the need data



