import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';


const Tasks = () => {
    const { userId, projectId } = useParams();
    const [projectDetails, setProjectDetails] = useState(null);
    const [taskTitle, setTaskTitle] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [tasks, setTasks] = useState([]);
    const [incompleteTasks, setIncompleteTasks] = useState([]);
    const [completedTasks, setCompletedTasks] = useState([]);
    const [editTaskId, setEditTaskId] = useState(null); 
    const [editProjectPopup, setEditProjectPopup] = useState(false); 

    useEffect(() => {
        const fetchProjectDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/projects/${projectId}`);
                setProjectDetails(response.data);
            } catch (error) {
                console.error('Error fetching project details:', error);
            }
        };

        fetchProjectDetails();
    }, [projectId]);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/tasks/project`, {
                    params: {
                        projectId: projectId
                    }
                });
                const allTasks = response.data;
                setTasks(allTasks);
                const incomplete = allTasks.filter(task => !task.completed);
                setIncompleteTasks(incomplete);
                const completed = allTasks.filter(task => task.completed);
                setCompletedTasks(completed);
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        };

        fetchTasks();
    }, [projectId]); 
    
    const handleAddTask = async () => {
        // Check if the task title is empty
        if (taskTitle.trim() === '') {
            console.warn('Task title cannot be empty');
            // Handle the case where the task title is empty (e.g., show an error message to the user)
            return;
        }
    
        const newTask = {
            userId: parseInt(userId),
            projectId: parseInt(projectId),
            title: taskTitle,
            description: taskDescription,
        };
    
        try {
            await axios.post('http://localhost:8080/api/tasks', newTask);
            console.log('Task added successfully');
            // Force page refresh after adding the task
            window.location.reload();
            // You can optionally fetch updated project details here
        } catch (error) {
            console.error('Error adding task:', error);
        }
    };    
    

    const handleCheckboxChange = async (taskId, checked) => {
        try {
            await axios.put(`http://localhost:8080/api/tasks/${taskId}`, { completed: checked });
            const updatedTasks = tasks.map(task =>
                task.taskId === taskId ? { ...task, completed: checked } : task
            );
            setTasks(updatedTasks);
            const incomplete = updatedTasks.filter(task => !task.completed);
            setIncompleteTasks(incomplete);
            const completed = updatedTasks.filter(task => task.completed);
            setCompletedTasks(completed);
        } catch (error) {
            console.error('Error updating task status:', error);
        }
    };

    const handleDeleteTask = async (taskId) => {
        try {
            await axios.delete(`http://localhost:8080/api/tasks/${taskId}`);
            const updatedTasks = tasks.filter(task => task.taskId !== taskId);
            setTasks(updatedTasks);
            const incomplete = updatedTasks.filter(task => !task.completed);
            setIncompleteTasks(incomplete);
            const completed = updatedTasks.filter(task => task.completed);
            setCompletedTasks(completed);
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    const handleEditTask = (taskId) => {
        const taskToEdit = tasks.find(task => task.taskId === taskId);
        setEditTaskId(taskId);
        setTaskTitle(taskToEdit.title);
        setTaskDescription(taskToEdit.description);
    };

    const handleUpdateTask = async () => {
        const updatedTask = {
            taskId: editTaskId,
            title: taskTitle,
            description: taskDescription,
        };
    
        // Log the updated task before sending the request
        console.log('Updated Task:', updatedTask);
        
        try {
            await axios.put(`http://localhost:8080/api/tasks/${editTaskId}/details`, updatedTask);
            // Update tasks state if necessary
            setEditTaskId(null);
    
            // Force page refresh
            window.location.reload();
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    const handleUpdateProject = async () => {
        if (projectDetails.title.trim() !== '') { // Check if the title is not empty
            const updatedProject = {
                projectId: projectDetails.projectId,
                title: projectDetails.title,
                description: projectDetails.description,
            };
    
            try {
                await axios.put(`http://localhost:8080/api/projects/updateById/${projectId}`, updatedProject);
                console.log('Project updated successfully');
                // You can optionally fetch updated project details here
                setEditProjectPopup(false);
            } catch (error) {
                console.error('Error updating project:', error);
            }
        } else {
            console.warn('Project title cannot be empty');
            // Handle the case where the title is empty (e.g., show an error message to the user)
        }
    };
    

    const generateMarkdownContent = () => {
        let markdown = `# ${projectDetails.title}\n\n`;
        markdown += `### Summary :`;
        markdown += ` ${completedTasks.length} / ${tasks.length}   tasks completed\n\n`;
    
        markdown += '### Task list of pending tasks\n'; // Decrease font size for heading
        incompleteTasks.forEach(task => {
            markdown += `- ⬜ ${task.title}\n`;
        });
    
        markdown += '\n### Task list of completed tasks\n'; // Decrease font size for heading
        completedTasks.forEach(task => {
            markdown += `- ✅ ${task.title}\n`;
        });
    
        return markdown;
    };
    
    

    const createSecretGist = async (markdownContent, accessToken) => {
        try {
            const response = await axios.post('https://api.github.com/gists', {
                files: {
                    [`${projectDetails.title}.md`]: { content: markdownContent }
                },                
                public: false
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            if (response.status === 201 && response.data && response.data.html_url) {
                return response.data.html_url;
            } else {
                throw new Error('Failed to create secret gist.');
            }
        } catch (error) {
            throw new Error(`Error creating secret gist: ${error.message}`);
        }
    };

    const handleExportSummary = async () => {
    const markdownContent = generateMarkdownContent();

    try {
        const gistUrl = await createSecretGist(markdownContent, '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');
        if (gistUrl) {
            console.log('Secret gist created successfully:', gistUrl);
            // Create a Blob with the markdown content
            const blob = new Blob([markdownContent], { type: 'text/markdown' });

            // Create a temporary link element to trigger the download
            const downloadLink = document.createElement('a');
            downloadLink.href = URL.createObjectURL(blob);
            downloadLink.download = `${projectDetails.title}.md`; // File name based on project title
            downloadLink.click();

            // You can provide feedback to the user here
        } else {
            console.log('Failed to create secret gist.');
            // Handle failure scenario
        }
    } catch (error) {
        console.error('Error creating secret gist:', error);
        // Handle error scenario
    }
};
const calculateProgress = () => {
    if (tasks.length === 0) return 0;
    return (completedTasks.length / tasks.length) * 100;
};

const circumference = 2 * Math.PI * 40;
const offset = circumference * ((100 - calculateProgress()) / 100);


    return (
        <div className="container w-4/5 lg:w-3/5 2xl:w-1/2 mx-auto mt-8">
            <h1 className="text-3xl font-bold mb-8">Project Details</h1>
            {projectDetails ? (
                <div className='border border-gray-300 rounded flex items-center justify-between p-4 mb-4'>
                    <div className="flex justify-center items-center">
                        <div style={{ position: 'relative', width: '100px', height: '100px' }}>
                            <svg width="100" height="100" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="40" fill="none" strokeWidth="10" stroke="#ccc" />
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="40"
                                    fill="none"
                                    strokeWidth="10"
                                    stroke="#007bff"
                                    strokeDasharray={`${circumference} ${circumference}`}
                                    strokeDashoffset={offset}
                                    transform="rotate(-90 50 50)"
                                />
                                <text x="50" y="50" textAnchor="middle" dominantBaseline="middle">
                                    {`${completedTasks.length}/${tasks.length}`}
                                </text>
                            </svg>
                        </div>
                        <div className='ml-4'>
                            <h2 className="text-2xl mb-2 font-bold">{projectDetails.title}</h2>
                            <p>{projectDetails.description}</p>
                        </div>
                    </div>
                    <div className='mr-2 flex items-center'>
                        <EditIcon className='text-blue-500' onClick={() => setEditProjectPopup(true)} style={{ cursor: 'pointer' }} />
                    </div>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        
        {editProjectPopup && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-8 rounded shadow-md">
                <h2 className="text-xl font-bold mb-4">Edit Project</h2>
                <input
                    type="text"
                    placeholder="Enter project title"
                    className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md"
                    value={projectDetails.title}
                    onChange={(e) => setProjectDetails({ ...projectDetails, title: e.target.value })}
                />
                <textarea
                    placeholder="Enter project description"
                    className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md"
                    value={projectDetails.description}
                    onChange={(e) => setProjectDetails({ ...projectDetails, description: e.target.value })}
                />
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={handleUpdateProject}
                >
                    Update Project
                </button>
                <button onClick={() => { setEditProjectPopup(false); window.location.reload(); }} className="ml-2">Cancel</button>
            </div>
        </div>
        )}


            <div className='border border-gray-300 rounded p-4 mb-2'>
            <form onSubmit={handleAddTask}>
                <input
                    type="text"
                    placeholder="Enter task title"
                    className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md"
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Enter task description"
                    className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md"
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                />
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Add Task
                </button>
            </form>
            </div>
            <div className='border border-gray-300 rounded p-2 mb-4'>
                <h2 className="text-xl font-bold mb-5">Incomplete Tasks</h2>
                {incompleteTasks.length > 0 ? (
                    incompleteTasks.map(task => (
                        <div key={task.taskId} className='mb-1 py-2 pl-2 flex rounded-lg bg-gray-50 items-center justify-between'>
                            <div className='flex items-center'>
                                <input
                                    type="checkbox"
                                    checked={false}
                                    className='mr-4 h-6 w-6'
                                    onChange={(e) => handleCheckboxChange(task.taskId, e.target.checked)}
                                />
                                <div>
                                    <label className='font-semibold'>{task.title}</label>
                                    <p>{task.description}</p>
                                </div>
                            </div>
                            <div className='mr-2'>
                                <DeleteIcon className='mr-2 text-red-500' onClick={() => handleDeleteTask(task.taskId)} style={{ cursor: 'pointer' }} />
                                {/* Replace Edit button with EditIcon */}
                                <EditIcon className='text-blue-500' onClick={() => handleEditTask(task.taskId)} style={{ cursor: 'pointer' }} />
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No incomplete tasks found.</p>
                )}
            </div>
            <div className='border border-gray-300 p-2 rounded mb-4'>
                <h2 className="text-xl font-bold mb-5">Completed Tasks</h2>
                {completedTasks.length > 0 ? (
                    completedTasks.map(task => (
                        <div key={task.taskId} className='mb-1 flex rounded-lg py-2 pl-2 bg-gray-50 items-center justify-between'>
                            <div className='flex items-center'>
                                <input
                                    type="checkbox"
                                    checked={true}
                                    className='mr-3 h-6 w-6'
                                    onChange={(e) => handleCheckboxChange(task.taskId, e.target.checked)}
                                />
                                <div>
                                    <label className='font-semibold'>{task.title}</label>
                                    <p>{task.description}</p>
                                </div>
                            </div>
                            <div className='mr-2'>
                                <DeleteIcon className='mr-2 text-red-500' onClick={() => handleDeleteTask(task.taskId)} style={{ cursor: 'pointer' }} />
                                {/* Replace Edit button with EditIcon */}
                                <EditIcon className= "text-blue-500" onClick={() => handleEditTask(task.taskId)} style={{ cursor: 'pointer' }} />
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No completed tasks found.</p>
                )}
            </div>
            {/* Edit Task Popup */}
            {editTaskId && (
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-8 rounded shadow-md">
                        <h2 className="text-xl font-bold mb-4">Edit Task</h2>
                        <input
                            type="text"
                            placeholder="Enter task title"
                            className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md"
                            value={taskTitle}
                            onChange={(e) => setTaskTitle(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Enter task description"
                            className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md"
                            value={taskDescription}
                            onChange={(e) => setTaskDescription(e.target.value)}
                        />
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            onClick={handleUpdateTask}
                        >
                            Update
                        </button>
                        <button onClick={() => { setEditTaskId(null); window.location.reload(); }} className="ml-2">Cancel</button>
                    </div>
                </div>
            )}

            {/* Export Button */}
            <button className="bg-green-500 mb-16 mt-8 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={handleExportSummary}>
                Export Summary as Gist
            </button>
        </div>
    );
};

export default Tasks;
