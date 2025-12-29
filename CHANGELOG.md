# Changelog

## [1.1.0] - 2025-12-29

### Fixed
- **Time limit enforcement now works in real-time**
  - Previously, time limits were only checked during page navigation
  - Now, when you reach your time limit while browsing, you're immediately redirected to the blocked page
  - No need to refresh the page for the limit to take effect

### Added
- **Edit functionality for time-limited websites**
  - Each time-limited site now has an "Edit" button alongside "Remove"
  - Click "Edit" to modify the time limit inline
  - Input field appears with current value pre-filled
  - "Save" button to confirm changes
  - "Cancel" button to discard changes
  - Keyboard shortcuts:
    - Press **Enter** to save
    - Press **Escape** to cancel
  - Auto-focus and auto-select the input field for quick editing

### Changed
- Time-limited sites now display with grouped "Edit" and "Remove" buttons
- Improved button styling with green for Save and gray for Cancel
- Better visual feedback during edit mode

## [1.0.0] - Initial Release

### Features
- Block websites completely
- Set daily time limits for websites
- Real-time time tracking
- Usage statistics
- Modern UI with gradient design
- Auto-reset at midnight
- Blocked page with productivity tips
