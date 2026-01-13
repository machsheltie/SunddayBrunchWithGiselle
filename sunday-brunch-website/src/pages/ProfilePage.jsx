import { useAuth } from '../hooks/useAuth'
import './ProfilePage.css'

/**
 * ProfilePage Component
 *
 * User profile page showing account information.
 * This is a protected route - only accessible to authenticated users.
 */
export default function ProfilePage() {
  const { user } = useAuth()

  if (!user) return null

  const displayName = user.user_metadata?.display_name || user.email?.split('@')[0] || 'User'

  return (
    <div className="profile-page">
      <div className="profile-page__container">
        <div className="profile-page__header">
          <div className="profile-page__avatar">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <h1 className="profile-page__title">My Profile</h1>
          <p className="profile-page__subtitle">Manage your account and preferences</p>
        </div>

        <div className="profile-page__content">
          {/* Account Information */}
          <section className="profile-section">
            <h2 className="profile-section__title">Account Information</h2>
            <div className="profile-section__content">
              <div className="profile-field">
                <label className="profile-field__label">Display Name</label>
                <p className="profile-field__value">{displayName}</p>
              </div>
              <div className="profile-field">
                <label className="profile-field__label">Email</label>
                <p className="profile-field__value">{user.email}</p>
              </div>
              <div className="profile-field">
                <label className="profile-field__label">Member Since</label>
                <p className="profile-field__value">
                  {new Date(user.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </section>

          {/* Activity Summary (Placeholder) */}
          <section className="profile-section">
            <h2 className="profile-section__title">Activity Summary</h2>
            <div className="profile-section__content">
              <div className="activity-stats">
                <div className="activity-stat">
                  <span className="activity-stat__value">0</span>
                  <span className="activity-stat__label">Recipes Rated</span>
                </div>
                <div className="activity-stat">
                  <span className="activity-stat__value">0</span>
                  <span className="activity-stat__label">Reviews Written</span>
                </div>
                <div className="activity-stat">
                  <span className="activity-stat__value">0</span>
                  <span className="activity-stat__label">Recipes Saved</span>
                </div>
              </div>
              <p className="activity-note">
                🎉 Start rating and reviewing recipes to see your activity here!
              </p>
            </div>
          </section>

          {/* Coming Soon */}
          <section className="profile-section">
            <h2 className="profile-section__title">Coming Soon</h2>
            <div className="profile-section__content">
              <ul className="coming-soon-list">
                <li>✨ Edit profile information</li>
                <li>🖼️ Upload profile picture</li>
                <li>⚙️ Notification preferences</li>
                <li>📧 Email preferences</li>
                <li>💾 Manage saved recipes</li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
