import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

const Projects = () => {
    const { userId } = useParams();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [projects, setProjects] = useState([]);

    const handleTitleChange = (e) => setTitle(e.target.value);
    const handleDescriptionChange = (e) => setDescription(e.target.value);

    const fetchProjectsByUserId = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/projects/user/${userId}`);
            setProjects(response.data);
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    };

    const handleAddProject = async () => {
        if (title.trim() === '') {
            // Title is empty, don't send the request
            console.log('Title cannot be empty');
            return;
        }
    
        const newProject = {
            userId: parseInt(userId),
            title: title,
            description: description,
        };
    
        try {
            const response = await axios.post('http://localhost:8080/api/projects', newProject);
            console.log('Project added successfully:', response.data);
            setProjects([...projects, newProject]);
            setTitle('');
            setDescription('');
            window.location.reload(); // Force reload the page after successful addition
        } catch (error) {
            console.error('Error adding project:', error);
        }
    };    
    

    const handleDeleteProject = async (projectId) => {
        try {
            console.log('Deleting project with ID:', projectId); // Log the projectId being passed
            await axios.delete(`http://localhost:8080/api/projects/delete/${projectId}`);
            console.log('Project deleted successfully:', projectId);
            window.location.reload(); // Force reload the page after successful deletion
        } catch (error) {
            console.error('Error deleting project:', error);
        }
    };
    


    const handleViewProject = (projectId) => {
        // Navigate to Tasks.js page with project ID and user ID
        window.location.href = `/tasks/${userId}/${projectId}`;
    };

    useEffect(() => {
        console.log('Fetching projects for userId:', userId);
        fetchProjectsByUserId();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId]);
    

    return (
        <div className="container w-4/5 lg:w-3/5 2xl:w-1/2 mx-auto mt-8">
            <h1 className='font-bold text-3xl mb-8'>Project Tracker</h1>
            <div className="">
            <form onSubmit={handleAddProject}>
                    <input
                        type="text"
                        placeholder="Enter project title"
                        className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md"
                        value={title}
                        onChange={handleTitleChange}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Enter project description"
                        className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md"
                        value={description}
                        onChange={handleDescriptionChange}
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Add Project
                    </button>
                </form>
                <div className="mt-4">
                    {projects.map((project, index) => (
                        <div key={index} className="border flex justify-between border-gray-300 rounded p-4 mb-2">
                            <div>
                                <h3 className="font-bold">{project.title}</h3>
                                <p>{project.description}</p>
                            </div>
                            <div className='flex items-center'>
                                <DeleteIcon
                                    className="text-red-500 cursor-pointer"
                                    onClick={() => handleDeleteProject(project.projectId)}
                                />
                                <VisibilityIcon
                                    className="text-blue-500 cursor-pointer ml-2"
                                    onClick={() => handleViewProject(project.projectId)}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Projects;
