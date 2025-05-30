import { useRouter } from 'next/router';
import { useQuery, gql, useMutation } from '@apollo/client';

const GET_TASK = gql`
  query Task($id: ID!) {
    task(id: $id) {
      _id
      title
      description
      status
      dueDate
    }
  }
`;

const UPDATE_STATUS = gql`
  mutation UpdateTaskStatus($id: ID!, $status: String!) {
    updateTaskStatus(id: $id, status: $status) {
      _id
      status
    }
  }
`;

export default function TaskDetail() {

  const router = useRouter();
  const { id } = router.query;
  const { data, loading } = useQuery(GET_TASK, { variables: { id } });
  const [updateStatus] = useMutation(UPDATE_STATUS);

  const handleChange = async (e) => {
    await updateStatus({ variables: { id, status: e.target.value } });
    router.reload();
  };

  if (loading || !data) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-200 flex items-center justify-center">
      <p className="text-2xl text-gray-600 font-medium">Loading...</p>
    </div>
  );


  return (
    <div className="min-h-screen  bg-blue-50 p-[24px]">
      <div className="max-w-[600px] mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-[30px] border border-gray-100">
          <h1 className="text-4xl capitalize font-bold  mb-[30px] bg-indigo-600  bg-clip-text text-transparent">
            {data.task.title}  
          </h1>
          
          <div className="space-y-[20px]">
            <p className="text-lg">
              <strong className="text-gray-700 font-semibold">Description:</strong> 
              <span className="ml-2 text-gray-600">{data.task.description}</span>
            </p>
            
            <p className="text-lg flex items-center">
              <strong className="text-gray-700 font-semibold">Status:</strong>
              <select 
                value={data.task.status} 
                onChange={handleChange} 
                className="ml-[16px] px-[16px] py-[8px] border-2 border-gray-200 rounded-lg focus:ring-1 outline-none bg-white text-gray-700 font-medium shadow-sm hover:border-gray-300"
              >
                <option>Todo</option>
                <option>In Progress</option>
                <option>Done</option>
              </select>
            </p>
            
            <p className="text-lg">
              <strong className="text-gray-700 font-semibold">Due:</strong> 
              <span className="ml-2 text-gray-600">{data.task.dueDate}</span>
            </p>

             <button
                  type="button"
                  onClick={() => router.push('/')}
                  className="flex-1 flex justify-center py-[8px] px-[16px] border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none "
                >
                  Back
                </button>
          </div>
        </div>
      </div>
    </div>
  );
}