import  { useState } from 'react';

export const EmailList = ({ users }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copySuccess, setCopySuccess] = useState('');

  const toggleExpand = () => {
    setIsExpanded(prevState => !prevState);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopySuccess(`Copied: ${text}`);
        setTimeout(() => setCopySuccess(''), 2000); // Reset message after 2 seconds
      })
      .catch(() => setCopySuccess('Failed to copy emails'));
  };

  const visibleEmails = users
    .map(user => user.email)
    .filter(email => email && email !== 'No email available')
    .join(', '); // Łączymy e-maile w jeden ciąg znaków

  return (
    <div>
      <button onClick={toggleExpand}>
        {isExpanded ? 'Collapse Users Emails' : 'Expand Users Emails'}
      </button>
      {isExpanded && (
        <div>
          <h3>Visible Emails:</h3>
          {visibleEmails.length > 0 ? (
            <div>
              <ul>
                {visibleEmails.split(', ').map((email, index) => (
                  <li key={index}>{email}</li>
                ))}
              </ul>
              <button onClick={() => copyToClipboard(visibleEmails)} className="copy-button">
                Copy All
              </button>
            </div>
          ) : (
            <p>No emails available</p>
          )}
          {copySuccess && <p className="copy-success">{copySuccess}</p>}
        </div>
      )}
    </div>
  );
};

