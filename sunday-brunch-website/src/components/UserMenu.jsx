/**
 * UserMenu Component
 *
 * Displays user profile menu when logged in.
 * Shows user email/name and sign out option.
 *
 * Features:
 * - Dropdown menu with user info
 * - Sign out button
 * - Whimsical design matching site aesthetic
 */

import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import './UserMenu.css'

export default function UserMenu() {
  const { user, signOut } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef(null)

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleSignOut = async () => {
    await signOut()
    setIsOpen(false)
  }

  if (!user) return null

  // Get display name (use email username if no display name set)
  const displayName = user.user_metadata?.display_name || user.email?.split('@')[0] || 'User'

  return (
    <div className="user-menu" ref={menuRef}>
      <button
        className="user-menu__trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="User menu"
        aria-expanded={isOpen}
      >
        <div className="user-menu__avatar">
          {displayName.charAt(0).toUpperCase()}
        </div>
        <span className="user-menu__name">{displayName}</span>
        <svg
          className={`user-menu__icon ${isOpen ? 'user-menu__icon--open' : ''}`}
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M4 6L8 10L12 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="user-menu__dropdown">
          <div className="user-menu__header">
            <div className="user-menu__avatar user-menu__avatar--large">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div className="user-menu__info">
              <p className="user-menu__display-name">{displayName}</p>
              <p className="user-menu__email">{user.email}</p>
            </div>
          </div>

          <div className="user-menu__divider" />

          <Link
            to="/profile"
            className="user-menu__item"
            onClick={() => setIsOpen(false)}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M10 2C11.1046 2 12 2.89543 12 4C12 5.10457 11.1046 6 10 6C8.89543 6 8 5.10457 8 4C8 2.89543 8.89543 2 10 2ZM10 12C12.7614 12 15 12.8954 15 14V16H5V14C5 12.8954 7.23858 12 10 12Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
            My Profile
          </Link>

          <div className="user-menu__divider" />

          <button
            className="user-menu__item"
            onClick={handleSignOut}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M7 17H4C3.46957 17 2.96086 16.7893 2.58579 16.4142C2.21071 16.0391 2 15.5304 2 15V5C2 4.46957 2.21071 3.96086 2.58579 3.58579C2.96086 3.21071 3.46957 3 4 3H7M13 13L17 9M17 9L13 5M17 9H7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Sign Out
          </button>
        </div>
      )}
    </div>
  )
}
