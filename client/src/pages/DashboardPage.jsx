import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProjectCard from '../components/ProjectCard.jsx';
import {
  getProjects,
  createProject,
  deleteProject,
} from '../services/projectService.js';
import { useToast } from '../contexts/ToastContext.jsx';

function DashboardPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { showToast } = useToast();

  const loadProjects = async () => {
    try {
      setLoading(true);

      const data = await getProjects();

      setProjects(data);
    } catch (error) {
      showToast(
        error.response?.data?.message || 'Failed to load projects.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleCreateProject = async () => {
    try {
      const project = await createProject('Untitled Project');

      navigate(`/builder/${project._id}`);
    } catch (error) {
      showToast(
        error.response?.data?.message || 'Failed to create project.',
        'error'
      );
    }
  };

  const handleDeleteProject = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this project?'
    );

    if (!confirmed) return;

    try {
      await deleteProject(id);

      setProjects((currentProjects) =>
        currentProjects.filter((project) => project._id !== id)
      );

      showToast('Project deleted successfully.', 'success');
    } catch (error) {
      showToast(
        error.response?.data?.message || 'Failed to delete project.',
        'error'
      );
    }
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <p className="dashboard-label">YOUR WORKSPACE</p>

          <h1>My Projects</h1>

          <p>
            Create and manage your AI-powered web applications.
          </p>
        </div>

        <button
          className="create-project-btn"
          onClick={handleCreateProject}
        >
          + New Project
        </button>
      </div>

      {loading ? (
        <div className="dashboard-loading">
          Loading projects...
        </div>
      ) : projects.length === 0 ? (
        <div className="empty-projects">
          <h2>No projects yet</h2>

          <p>
            Create your first application with NxtBuild.
          </p>

          <button
            className="create-project-btn"
            onClick={handleCreateProject}
          >
            Create Your First Project
          </button>
        </div>
      ) : (
        <div className="projects-grid">
          {projects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              onDelete={handleDeleteProject}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default DashboardPage;