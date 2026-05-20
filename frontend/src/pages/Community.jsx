import React, { useState, useEffect } from 'react';
import '../css/community.css';
import api from '../api';

function Community({ user }) {
  const dummyPosts = [
    {
      _id: '1',
      title: 'Fake Bank Verification Email - Bank of India',
      description: 'Received an email claiming to be from Bank of India asking to verify my account details. Email was sent from "bankofindla@gmail.com" with a phishing link. The message contained urgent language about account suspension.',
      category: 'email',
      severity: 'high',
      author: { id: 'user123', name: 'Rajesh Kumar' },
      upvotes: 247,
      upvotedBy: [],
      replies: [
        { id: 'reply1', userName: 'Priya Singh', content: 'I received the same email! Logged in through their official website instead. Thanks for posting!' },
        { id: 'reply2', userName: 'Amit Patel', content: 'This is a common phishing attempt. Never click links in emails. Always go directly to the bank website.' }
      ],
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    },
    {
      _id: '2',
      title: 'Suspicious UPI Payment Request - "Confirm Refund"',
      description: 'Received a WhatsApp message saying "Your Amazon refund is ready. Click here to confirm UPI payment details". The link looked like an UPI request but was actually trying to get my payment credentials. The sender profile had a generic photo.',
      category: 'upi',
      severity: 'high',
      author: { id: 'user456', name: 'Neha Gupta' },
      upvotes: 189,
      upvotedBy: [],
      replies: [
        { id: 'reply3', userName: 'Vikram Rao', content: 'Never share your UPI PIN or payment details with anyone!' }
      ],
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    },
    {
      _id: '3',
      title: 'Malicious QR Code in Metro Station',
      description: 'Found QR codes pasted over official UPI payment QR codes in a metro station. Scanned it with my phone and it tried to redirect to a payment portal asking for card details. Be careful when scanning QR codes from unknown sources.',
      category: 'qr',
      severity: 'high',
      author: { id: 'user789', name: 'Arun Verma' },
      upvotes: 312,
      upvotedBy: [],
      replies: [
        { id: 'reply4', userName: 'Sanjay Iyer', content: 'This is happening in Bangalore too. Should report to authorities.' },
        { id: 'reply5', userName: 'Anjali Bose', content: 'Always verify the QR code destination before entering any payment information.' }
      ],
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    },
    {
      _id: '4',
      title: 'LinkedIn Job Scam - Fake Amazon Offer',
      description: 'Fake LinkedIn recruiter offered me a job at Amazon with an unrealistic salary. Asked me to pay 500 rupees for "verification fees". The profile had minimal connections and was created recently.',
      category: 'email',
      severity: 'medium',
      author: { id: 'user321', name: 'Deepak Sharma' },
      upvotes: 156,
      upvotedBy: [],
      replies: [
        { id: 'reply6', userName: 'Pooja Nair', content: 'Job scams are becoming more sophisticated. Never pay upfront fees for job offers.' }
      ],
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
    },
    {
      _id: '5',
      title: 'Phishing URL - Looks Like Amazon',
      description: 'Received email with link "amzn-secure-verify.com" claiming urgent account action needed. Domain looks similar to Amazon but is not official. The email contained my name but was actually mass spam.',
      category: 'url',
      severity: 'high',
      author: { id: 'user654', name: 'Suresh Reddy' },
      upvotes: 203,
      upvotedBy: [],
      replies: [
        { id: 'reply7', userName: 'Divya Menon', content: 'Always check the domain name carefully. Hover over links without clicking.' },
        { id: 'reply8', userName: 'Rohan Singh', content: 'I almost fell for this! Thanks for the alert.' }
      ],
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    },
    {
      _id: '6',
      title: 'WhatsApp Payment Scam - Group Message',
      description: 'Received a WhatsApp message from an unknown number claiming to be from my bank. The message had a payment link and asked to confirm my identity. Typical phishing attempt trying to get account details.',
      category: 'other',
      severity: 'medium',
      author: { id: 'user987', name: 'Kavya Rajagopal' },
      upvotes: 98,
      upvotedBy: [],
      replies: [],
      createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
    },
    {
      _id: '7',
      title: 'SBI Account Verification Email',
      description: 'Email claiming to be from SBI asking to update transaction limits. Link redirected to a fake website that looked identical to SBI\'s original portal. Tried to harvest login credentials.',
      category: 'email',
      severity: 'high',
      author: { id: 'user111', name: 'Madhav Kulkarni' },
      upvotes: 178,
      upvotedBy: [],
      replies: [
        { id: 'reply9', userName: 'Isha Kapoor', content: 'Banks never ask for credentials via email. Always access your account directly.' }
      ],
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    },
    {
      _id: '8',
      title: 'Fake GPay PIN Update Scam',
      description: 'Received a notification that looked like GPay saying "Unusual activity detected. Update your PIN". Clicking on it tried to capture my PIN entry. The notification was from a fake app.',
      category: 'upi',
      severity: 'high',
      author: { id: 'user222', name: 'Nathan Pereira' },
      upvotes: 267,
      upvotedBy: [],
      replies: [
        { id: 'reply10', userName: 'Ananya Chopra', content: 'Never enter your PIN if you didn\'t initiate the transaction. Even Google doesn\'t ask for PIN via notifications.' }
      ],
      createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000)
    }
  ];

  const [posts, setPosts] = useState(dummyPosts);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [replyContent, setReplyContent] = useState({});
  const [improvementSuggestion, setImprovementSuggestion] = useState(null);
  const [improvingField, setImprovingField] = useState(null);
  const [isImproving, setIsImproving] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'email',
    severity: 'medium'
  });

  useEffect(() => {
    fetchPosts();
  }, [selectedCategory]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      // Start with dummy posts
      let allPosts = [...dummyPosts];
      
      // Try to fetch from API
      try {
        const url = selectedCategory === 'all' 
          ? '/api/community/posts'
          : `/api/community/posts/category/${selectedCategory}`;
        
        const response = await api.get(url);
        const apiPosts = response.data.posts || response.data;
        
        // Combine dummy posts with API posts
        allPosts = [...dummyPosts, ...apiPosts];
      } catch (apiError) {
        console.log('Could not fetch from API, showing dummy posts only:', apiError.message);
      }
      
      // Filter based on selected category
      if (selectedCategory === 'all') {
        setPosts(allPosts);
      } else {
        setPosts(allPosts.filter(post => post.category === selectedCategory));
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const postData = {
        ...formData,
        userId: user.id,
        userName: user.name
      };

      await api.post('/api/community/posts', postData);
      
      setFormData({ title: '', description: '', category: 'email', severity: 'medium' });
      setShowCreateForm(false);
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post');
    }
  };

  const handleUpvote = async (postId) => {
    try {
      await api.post(`/api/community/posts/${postId}/upvote`, { userId: user.id });
      fetchPosts();
    } catch (error) {
      console.error('Error upvoting:', error);
    }
  };

  const handleReply = async (postId) => {
    if (!replyContent[postId]?.trim()) {
      alert('Please enter a reply');
      return;
    }

    try {
      await api.post(`/api/community/posts/${postId}/reply`, {
        userId: user.id,
        userName: user.name,
        content: replyContent[postId]
      });

      setReplyContent({ ...replyContent, [postId]: '' });
      fetchPosts();
    } catch (error) {
      console.error('Error adding reply:', error);
      alert('Failed to add reply');
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      await api.delete(`/api/community/posts/${postId}`, {
        data: { userId: user.id }
      });
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post');
    }
  };

  const handleImproveText = async (field) => {
    const text = field === 'title' ? formData.title : formData.description;
    
    if (!text.trim()) {
      alert('Please enter some text first');
      return;
    }

    setIsImproving(true);
    setImprovingField(field);

    try {
      const response = await api.post('/api/community/improve-text', { text });
      setImprovementSuggestion({
        field,
        original: text,
        improved: response.data.improved
      });
    } catch (error) {
      console.error('Error improving text:', error);
      alert('Failed to improve text. Please check if Gemini API is configured.');
    } finally {
      setIsImproving(false);
    }
  };

  const handleAcceptImprovement = () => {
    if (!improvementSuggestion) return;

    const { field, improved } = improvementSuggestion;
    setFormData({
      ...formData,
      [field]: improved
    });
    setImprovementSuggestion(null);
  };

  const handleRejectImprovement = () => {
    setImprovementSuggestion(null);
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high':
        return '#e74c3c';
      case 'medium':
        return '#f39c12';
      case 'low':
        return '#27ae60';
      default:
        return '#95a5a6';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const categoryOptions = [
    { value: 'all', label: 'All Scams' },
    { value: 'email', label: 'Email Phishing' },
    { value: 'url', label: 'Phishing URLs' },
    { value: 'qr', label: 'Malicious QR' },
    { value: 'upi', label: 'UPI Scams' },
    { value: 'other', label: 'Other' }
  ];

  return (
    <div className="community-container">
      <div className="community-header">
        <h1>Community Security Feed</h1>
        <p>Share and stay informed about scams and threats</p>
      </div>

      <div className="community-controls">
        <button 
          className="btn-create-post"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? 'Cancel' : '+ Create Post'}
        </button>

        <div className="category-filters">
          {categoryOptions.map(cat => (
            <button
              key={cat.value}
              className={`category-btn ${selectedCategory === cat.value ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.value)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {showCreateForm && (
        <div className="create-post-form">
          <h2>Report a New Scam</h2>
          <form onSubmit={handleCreatePost}>
            <div className="form-group">
              <div className="form-label-row">
                <label htmlFor="title">Title *</label>
                <button 
                  type="button"
                  className="btn-improve-ai"
                  onClick={() => handleImproveText('title')}
                  disabled={isImproving}
                >
                  {isImproving && improvingField === 'title' ? '✨ Improving...' : '✨ Improve with AI'}
                </button>
              </div>
              <input
                type="text"
                id="title"
                placeholder="Brief description of the scam"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                maxLength="200"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category">Category *</label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="email">Email Phishing</option>
                  <option value="url">Phishing URL</option>
                  <option value="qr">Malicious QR</option>
                  <option value="upi">UPI Scam</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="severity">Severity *</label>
                <select
                  id="severity"
                  value={formData.severity}
                  onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <div className="form-label-row">
                <label htmlFor="description">Description *</label>
                <button 
                  type="button"
                  className="btn-improve-ai"
                  onClick={() => handleImproveText('description')}
                  disabled={isImproving}
                >
                  {isImproving && improvingField === 'description' ? '✨ Improving...' : '✨ Improve with AI'}
                </button>
              </div>
              <textarea
                id="description"
                placeholder="Provide detailed information about the scam, what it targeted, and any indicators you noticed..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="6"
                maxLength="5000"
              ></textarea>
              <div className="char-count">{formData.description.length}/5000</div>
            </div>

            <button type="submit" className="btn-submit">Post to Community</button>
          </form>
        </div>
      )}

      <div className="posts-container">
        {loading ? (
          <div className="loading">Loading posts...</div>
        ) : posts.length === 0 ? (
          <div className="no-posts">
            <p>No posts yet. Be the first to share a scam alert!</p>
          </div>
        ) : (
          posts.map(post => (
            <div key={post._id} className="community-post">
              <div className="post-header">
                <div className="post-title-section">
                  <h3 className="post-title">{post.title}</h3>
                  <span 
                    className="severity-badge"
                    style={{ backgroundColor: getSeverityColor(post.severity) }}
                  >
                    {post.severity.toUpperCase()}
                  </span>
                </div>
                <span className="post-category">{post.category}</span>
              </div>

              <div className="post-meta">
                <span className="author">by {post.author.name}</span>
                <span className="date">{formatDate(post.createdAt)}</span>
              </div>

              <p className="post-description">{post.description}</p>

              <div className="post-actions">
                <button 
                  className={`action-btn upvote-btn ${
                    post.upvotedBy?.includes(user.id) ? 'active' : ''
                  }`}
                  onClick={() => handleUpvote(post._id)}
                >
                  👍 {post.upvotes}
                </button>

                <button 
                  className="action-btn comment-btn"
                  onClick={() => setExpandedPostId(expandedPostId === post._id ? null : post._id)}
                >
                  💬 {post.replies?.length || 0}
                </button>

                {post.author.id === user.id && (
                  <button 
                    className="action-btn delete-btn"
                    onClick={() => handleDeletePost(post._id)}
                  >
                    🗑️ Delete
                  </button>
                )}
              </div>

              {expandedPostId === post._id && (
                <div className="post-expanded">
                  <div className="replies-section">
                    <h4>Responses ({post.replies?.length || 0})</h4>
                    
                    {post.replies && post.replies.length > 0 ? (
                      <div className="replies-list">
                        {post.replies.map((reply, idx) => (
                          <div key={idx} className="reply">
                            <div className="reply-header">
                              <span className="reply-author">{reply.userName}</span>
                              <span className="reply-date">{formatDate(reply.createdAt)}</span>
                            </div>
                            <p className="reply-content">{reply.content}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="no-replies">No responses yet. Be the first!</p>
                    )}

                    <div className="reply-form">
                      <textarea
                        placeholder="Share your experience or additional info..."
                        value={replyContent[post._id] || ''}
                        onChange={(e) => setReplyContent({ ...replyContent, [post._id]: e.target.value })}
                        rows="3"
                      ></textarea>
                      <button 
                        className="btn-reply"
                        onClick={() => handleReply(post._id)}
                      >
                        Post Response
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* AI Improvement Suggestion Modal */}
      {improvementSuggestion && (
        <div className="modal-overlay">
          <div className="improvement-modal">
            <div className="modal-header">
              <h3>✨ AI Improvement Suggestion</h3>
              <button 
                className="close-btn"
                onClick={handleRejectImprovement}
              >
                ✕
              </button>
            </div>

            <div className="modal-content">
              <div className="comparison">
                <div className="original">
                  <h4>Original {improvementSuggestion.field}:</h4>
                  <p>{improvementSuggestion.original}</p>
                </div>

                <div className="improved">
                  <h4>Improved {improvementSuggestion.field}:</h4>
                  <p>{improvementSuggestion.improved}</p>
                </div>
              </div>

              <div className="modal-actions">
                <button 
                  className="btn-accept"
                  onClick={handleAcceptImprovement}
                >
                  ✓ Accept & Update
                </button>
                <button 
                  className="btn-reject"
                  onClick={handleRejectImprovement}
                >
                  ✕ Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Community;
