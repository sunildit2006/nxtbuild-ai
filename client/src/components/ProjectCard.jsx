import { useNavigate } from 'react-router-dom';

function ProjectCard({ project, onDelete }) {
  const navigate = useNavigate();

  const handleOpen = () => {
    navigate(`/builder/${project._id}`);
  };

  return (
    <div className="project-card">
      <div className="project-card-content">
        <h3 className="project-card-title">
          {project.title}
        </h3>

        <p className="project-card-description">
          {project.description || 'No description yet.'}
        </p>

        <p className="project-card-date">
          Updated:{' '}
          {new Date(project.updatedAt).toLocaleDateString()}
        </p>
      </div>

      <div className="project-card-actions">
        <button
          className="project-open-btn"
          onClick={handleOpen}
        >
          Open
        </button>

        <button
          className="project-delete-btn"
          onClick={() => onDelete(project._id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default ProjectCard;