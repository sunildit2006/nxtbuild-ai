import Project from '../models/Project.model.js';

export const getUserProjects = async (userId) => {
  return await Project.find({ userId }).sort({ updatedAt: -1 });
};

export const getProjectById = async (projectId, userId) => {
  const project = await Project.findOne({ _id: projectId, userId });

  if (!project) {
    const error = new Error('Project not found');
    error.statusCode = 404;
    throw error;
  }

  return project;
};

export const createProject = async (userId, title = 'Untitled Project') => {
  return await Project.create({
    userId,
    title,
  });
};

export const updateProject = async (projectId, userId, updates) => {
  const project = await getProjectById(projectId, userId);

  if (updates.title !== undefined) {
    project.title = updates.title;
  }

  if (updates.description !== undefined) {
    project.description = updates.description;
  }

  project.updatedAt = new Date();

  await project.save();

  return project;
};

export const deleteProject = async (projectId, userId) => {
  const project = await Project.findOneAndDelete({
    _id: projectId,
    userId,
  });

  if (!project) {
    const error = new Error('Project not found');
    error.statusCode = 404;
    throw error;
  }

  return {
    message: 'Project deleted successfully',
  };
};