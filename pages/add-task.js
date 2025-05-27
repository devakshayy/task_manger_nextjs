import { useState } from 'react';
import { useRouter } from 'next/router';

export default function AddTask() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
    dueDate: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation AddTask($title: String!, $description: String, $status: String!, $dueDate: String) {
              addTask(title: $title, description: $description, status: $status, dueDate: $dueDate) {
                _id
                title
                description
                status
                dueDate
              }
            }
          `,
          variables: {
            title: formData.title,
            description: formData.description || null,
            status: formData.status,
            dueDate: formData.dueDate || null
          }
        }),
      });

      const result = await response.json();

      if (result.errors) {
        throw new Error(result.errors[0].message);
      }

      setFormData({
        title: '',
        description: '',
        status: 'pending',
        dueDate: ''
      });

      router.push('/');
    } catch (err) {
      setError(err.message || 'Failed to add task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-200 py-[10px] px-[16px] sm:px-6 lg:px-8">
        <div className="max-w-[500px] mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-8">
              Add New Task
            </h1>
          </div>

          <div className="bg-white py-8 px-[24px] shadow-md rounded-lg">
            {error && (
               <div className='text-center text-red-500'>
                  {error} !!!
               </div>
             )} 

            <form onSubmit={handleSubmit} className="space-y-[20px]">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Title <span className='text-red-700'>*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="mt-1 text-gray-800 block w-full px-[12px] py-[8px] border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:border-blue-300"
                  placeholder="Enter task title"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  className="mt-1 text-gray-800 block w-full px-[12px] py-[8px] border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:border-blue-300"
                  placeholder="Enter task description..."
                />
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  Status <span className='text-red-700'>*</span>
                </label>
                <select
                  id="status"
                  name="status"
                  required
                  value={formData.status}
                  onChange={handleChange}
                  className="mt-1 text-gray-800 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-300"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div>
                <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
                  Due Date
                </label>
                <input
                  type="date"
                  id="dueDate"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className="mt-1 text-gray-500 block w-full px-[12px] py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex justify-center py-[8px] px-[16px] border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none "
                >
                  Add Task
                </button>
                
                <button
                  type="button"
                  onClick={() => router.push('/')}
                  className="flex-1 flex justify-center py-[8px] px-[16px] border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none "
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}