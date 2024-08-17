
export const UserCard = ({ user }) => {
  return (
    <li>
      <div>
        <img src={user.avatar_url} alt={user.login} width="80" />
        <h2>{user.login}</h2>
        <p>Type: {user.type}</p>
        <p>Bio: {user.bio ? user.bio : 'No bio available'}</p>
        <p>
          Blog: {user.blog ? <a href={user.blog} target="_blank" rel="noopener noreferrer">{user.blog}</a> : 'No blog available'}
        </p>
        <p>Company: {user.company ? user.company : 'No company available'}</p>
        <p>Location: {user.location ? user.location : 'No location available'}</p>
        <p>Twitter username : {user.twitter_username ? user.twitter_username : 'No twitter username available'}</p>
        <p>Total Stars: {user.totalStars}</p>
        <p>Name: {user.name}</p>
        <p>Email: {user.email}</p>
        <a href={user.html_url} target="_blank" rel="noopener noreferrer">Profile</a>
        {user.socialLinks && user.socialLinks.length > 0 && (
          <div>
            <h3>Social Links:</h3>
            <ul>
              {user.socialLinks.map((link, index) => (
                <li key={index}>
                  <a href={link} target="_blank" rel="noopener noreferrer">{link}</a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </li>
  );
};

