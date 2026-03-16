'use strict';

const STORAGE_KEY = 'userProfile';
let statusHideTimer = null;

const DEFAULT_PROFILE = {
  displayName: '',
  email: '',
  bio: '',
  avatarUrl: '',
  theme: 'system',
  notifyEmail: false,
  notifyBrowser: false,
};

function loadProfile() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? { ...DEFAULT_PROFILE, ...JSON.parse(stored) } : { ...DEFAULT_PROFILE };
  } catch {
    return { ...DEFAULT_PROFILE };
  }
}

function saveProfile(profile) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

function applyTheme(theme) {
  const root = document.documentElement;
  root.removeAttribute('data-theme');
  if (theme === 'light' || theme === 'dark') {
    root.setAttribute('data-theme', theme);
  }
}

function populateForm(profile) {
  document.getElementById('display-name').value = profile.displayName;
  document.getElementById('email').value = profile.email;
  document.getElementById('bio').value = profile.bio;
  document.getElementById('avatar-url').value = profile.avatarUrl;
  document.getElementById('theme').value = profile.theme;
  document.getElementById('notify-email').checked = profile.notifyEmail;
  document.getElementById('notify-browser').checked = profile.notifyBrowser;

  updateBioCount(profile.bio.length);
  updateAvatarPreview(profile.avatarUrl);
  applyTheme(profile.theme);
}

function readForm() {
  return {
    displayName: document.getElementById('display-name').value.trim(),
    email: document.getElementById('email').value.trim(),
    bio: document.getElementById('bio').value.trim(),
    avatarUrl: document.getElementById('avatar-url').value.trim(),
    theme: document.getElementById('theme').value,
    notifyEmail: document.getElementById('notify-email').checked,
    notifyBrowser: document.getElementById('notify-browser').checked,
  };
}

function updateBioCount(length) {
  const counter = document.getElementById('bio-count');
  counter.textContent = `${length} / 300`;
  counter.classList.toggle('char-count--near-limit', length >= 270);
}

function updateAvatarPreview(url) {
  const preview = document.getElementById('avatar-preview');
  if (url) {
    preview.src = url;
    preview.hidden = false;
  } else {
    preview.hidden = true;
    preview.src = '';
  }
}

function showStatus(message, isError = false) {
  const el = document.getElementById('save-status');
  el.textContent = message;
  el.className = 'save-status' + (isError ? ' save-status--error' : ' save-status--success');
  el.hidden = false;
  clearTimeout(statusHideTimer);
  statusHideTimer = setTimeout(() => { el.hidden = true; }, 3000);
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('jubilant-couscous app loaded');

  // Mobile nav toggle
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close menu when a nav link is clicked
    navLinks.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }
  const profile = loadProfile();
  populateForm(profile);

  // Bio character counter
  document.getElementById('bio').addEventListener('input', (e) => {
    updateBioCount(e.target.value.length);
  });

  // Avatar URL preview
  document.getElementById('avatar-url').addEventListener('input', (e) => {
    updateAvatarPreview(e.target.value.trim());
  });

  // Theme change preview
  document.getElementById('theme').addEventListener('change', (e) => {
    applyTheme(e.target.value);
  });

  // Form submit — save settings
  document.getElementById('profile-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const updated = readForm();
    saveProfile(updated);
    applyTheme(updated.theme);
    showStatus('Profile saved successfully.');
  });

  // Reset button — restore last saved state
  document.getElementById('reset-btn').addEventListener('click', () => {
    const saved = loadProfile();
    populateForm(saved);
    showStatus('Changes discarded.');
  });
});
