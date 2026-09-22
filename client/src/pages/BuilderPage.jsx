import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import ChatMessage from '../components/ChatMessage.jsx';
import ChatInput from '../components/ChatInput.jsx';
import CodeEditor from '../components/CodeEditor.jsx';
import LivePreview from '../components/LivePreview.jsx';

import {
  getProject,
  updateProject,
} from '../services/projectService.js';

import { generateCode } from '../services/generationService.js';
import { useToast } from '../contexts/ToastContext.jsx';

function BuilderPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [project, setProject] = useState(null);
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('preview');

  const examplePrompts = [
    'A personal portfolio website with a dark theme',
    'A simple calculator app',
    'A weather dashboard with cards',
    'A landing page for a coffee shop',
    'A to-do list app',
    'A countdown timer for New Year',
  ];

  const loadProject = async () => {
    try {
      setLoading(true);

      const data = await getProject(projectId);

      setProject(data);
      setTitle(data.title);
      setCode(data.generatedCode || '');
    } catch (error) {
      showToast(
        error.response?.data?.message || 'Failed to load project.',
        'error'
      );

      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProject();
  }, [projectId]);

  const handleTitleBlur = async () => {
    if (!project || !title.trim()) return;

    try {
      const updatedProject = await updateProject(projectId, {
        title: title.trim(),
      });

      setProject(updatedProject);
      setTitle(updatedProject.title);
    } catch (error) {
      showToast('Failed to update project title.', 'error');
    }
  };

  const handleSend = async (prompt) => {
    try {
      setGenerating(true);

      const result = await generateCode(projectId, prompt);

      setCode(result.generatedCode || '');

      setProject((current) => ({
        ...current,
        generatedCode: result.generatedCode,
        messages: [
          ...(current?.messages || []),
          {
            role: 'user',
            content: prompt,
            timestamp: new Date(),
          },
          result.message,
        ],
      }));

      setActiveTab('preview');
    } catch (error) {
      showToast(
        error.response?.data?.message ||
          'Failed to generate code.',
        'error'
      );
    } finally {
      setGenerating(false);
    }
  };

  const handleCodeChange = async (newCode) => {
    setCode(newCode);
  };

  const handleDownload = () => {
    if (!code) return;

    const blob = new Blob([code], {
      type: 'text/html',
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');

    link.href = url;
    link.download = `${title || 'nxtbuild-project'}.html`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  };

  const handleSaveCode = async () => {
    try {
      const updatedProject = await updateProject(projectId, {
        description: project?.description || '',
      });

      setProject(updatedProject);

      showToast('Project saved.', 'success');
    } catch (error) {
      showToast('Failed to save project.', 'error');
    }
  };

  if (loading) {
    return (
      <div className="builder-loading">
        Loading builder...
      </div>
    );
  }

  return (
    <div className="builder-page">
      <div className="builder-header">
        <div className="builder-title-section">
          <button
            className="builder-back-btn"
            onClick={() => navigate('/dashboard')}
          >
            ←
          </button>

          <input
            className="builder-title-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleTitleBlur}
          />
        </div>

        <div className="builder-actions">
          <button
            className="builder-save-btn"
            onClick={handleSaveCode}
          >
            Save
          </button>

          <button
            className="builder-download-btn"
            onClick={handleDownload}
            disabled={!code}
          >
            Download HTML
          </button>
        </div>
      </div>

      <div className="builder-content">
        <aside className="builder-chat-panel">
          <div className="chat-panel-header">
            <h2>Build with AI</h2>
            <p>Describe what you want to create.</p>
          </div>

          <div className="chat-messages">
            {project?.messages?.length > 0 ? (
              project.messages.map((message, index) => (
                <ChatMessage
                  key={`${message.timestamp}-${index}`}
                  message={message}
                />
              ))
            ) : (
              <div className="chat-welcome">
                <h3>What do you want to build?</h3>

                <p>
                  Describe your idea and NxtBuild will generate
                  the application for you.
                </p>

                <div className="example-prompts">
                  {examplePrompts.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => handleSend(prompt)}
                      disabled={generating}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {generating && (
              <div className="typing-indicator">
                NxtBuild is generating...
              </div>
            )}
          </div>

          <ChatInput
            onSend={handleSend}
            loading={generating}
            disabled={false}
          />
        </aside>

        <main className="builder-preview-panel">
          <div className="preview-toolbar">
            <div className="preview-tabs">
              <button
                className={
                  activeTab === 'preview'
                    ? 'preview-tab active'
                    : 'preview-tab'
                }
                onClick={() => setActiveTab('preview')}
              >
                Preview
              </button>

              <button
                className={
                  activeTab === 'code'
                    ? 'preview-tab active'
                    : 'preview-tab'
                }
                onClick={() => setActiveTab('code')}
              >
                Code
              </button>
            </div>
          </div>

          <div className="builder-preview-content">
            {activeTab === 'preview' ? (
              <LivePreview code={code} />
            ) : (
              <CodeEditor
                code={code}
                onChange={handleCodeChange}
                readOnly={false}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default BuilderPage;