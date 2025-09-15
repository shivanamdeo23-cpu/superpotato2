# Simple Translation System Guide

## Overview
This guide explains how to use the simple translation system I've set up for your website. You can now easily add and edit translations without any coding experience!

## File Structure
```
client/
├── translations/
│   ├── en.json          # English translations
│   └── hi.json          # Hindi translations
├── src/lib/
│   └── simple-translations.js  # Translation loader script
└── demo-translation.html       # Example usage
```

## How to Add/Edit Translations

### Step 1: Edit JSON Files
The translation files are organized by language:

**English translations:** `client/translations/en.json`
**Hindi translations:** `client/translations/hi.json`

Each file contains nested categories like this:
```json
{
  "navigation": {
    "home": "Home",
    "about": "About"
  },
  "hero": {
    "title": "Early Detection Saves Lives",
    "subtitle": "Comprehensive bone health resources..."
  }
}
```

### Step 2: Adding New Translations
To add a new text that needs translation:

1. **Choose a logical category** (navigation, hero, footer, etc.)
2. **Add the same key to both language files**
3. **Provide the translation in each language**

Example - Adding a new button:
```json
// In en.json
"buttons": {
  "learnMore": "Learn More"
}

// In hi.json  
"buttons": {
  "learnMore": "और जानें"
}
```

### Step 3: Using Translations in HTML
Add the `data-i18n` attribute to any HTML element you want to translate:

```html
<!-- Basic text translation -->
<h1 data-i18n="hero.title">Early Detection Saves Lives</h1>

<!-- Button text -->
<button data-i18n="buttons.learnMore">Learn More</button>

<!-- Input placeholder -->
<input type="text" data-i18n="search.placeholder" placeholder="Search...">

<!-- Link text -->
<a href="/about" data-i18n="navigation.about">About</a>
```

## Language Switcher Setup

### Basic HTML Language Switcher
Add these buttons anywhere on your page:
```html
<div class="language-switcher">
  <button data-language="en">English</button>
  <button data-language="hi">हिंदी</button>
</div>
```

### CSS for Language Switcher (Optional)
```css
.language-btn {
  background: #0066cc;
  color: white;
  border: none;
  padding: 8px 16px;
  margin-left: 10px;
  border-radius: 4px;
  cursor: pointer;
}

.language-btn.active {
  background: #004499;
  font-weight: bold;
}
```

## How to Use the System

### Step 1: Include the Script
Add this line to your HTML files (before the closing `</body>` tag):
```html
<script type="module" src="/src/lib/simple-translations.js"></script>
```

### Step 2: Add Translation Keys
Replace your existing text with `data-i18n` attributes:

**Before:**
```html
<h1>Welcome to Our Website</h1>
```

**After:**
```html
<h1 data-i18n="welcome.title">Welcome to Our Website</h1>
```

### Step 3: Add to Translation Files
```json
// en.json
{
  "welcome": {
    "title": "Welcome to Our Website"
  }
}

// hi.json
{
  "welcome": {
    "title": "हमारी वेबसाइट में आपका स्वागत है"
  }
}
```

## Translation Key Naming Convention

Use descriptive, nested keys:
- `navigation.home` - Navigation items
- `hero.title` - Hero section content  
- `footer.copyright` - Footer content
- `buttons.submit` - Button text
- `forms.email` - Form labels
- `messages.success` - User messages

## Example: Complete Page Setup

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <title data-i18n="page.title">Bone Health Resources</title>
</head>
<body>
    <!-- Language Switcher -->
    <div class="language-switcher">
        <button data-language="en">English</button>
        <button data-language="hi">हिंदी</button>
    </div>

    <!-- Navigation -->
    <nav>
        <a href="/" data-i18n="navigation.home">Home</a>
        <a href="/about" data-i18n="navigation.about">About</a>
        <a href="/contact" data-i18n="navigation.contact">Contact</a>
    </nav>

    <!-- Main Content -->
    <main>
        <h1 data-i18n="hero.title">Early Detection Saves Lives</h1>
        <p data-i18n="hero.subtitle">Comprehensive bone health resources...</p>
        
        <button data-i18n="hero.cta">Take Risk Assessment</button>
    </main>

    <!-- Load Translation Script -->
    <script type="module" src="/src/lib/simple-translations.js"></script>
</body>
</html>
```

## Adding New Languages

To add a new language (e.g., Spanish):

1. **Create new translation file:** `client/translations/es.json`
2. **Copy structure from `en.json`** and translate all values
3. **Update supported languages** in `simple-translations.js`:
   ```javascript
   this.supportedLanguages = ['en', 'hi', 'es'];
   ```
4. **Add language button:**
   ```html
   <button data-language="es">Español</button>
   ```

## Testing Your Translations

1. **Open the demo page:** `http://your-website.com/demo-translation.html`
2. **Click language buttons** to see translations change
3. **Check browser developer tools** for any errors
4. **Test on mobile devices** to ensure responsive design

## Troubleshooting

### Translations Not Loading
- Check that JSON files are valid (no syntax errors)
- Ensure the translation script is loaded after HTML content
- Check browser developer tools for error messages

### Missing Translations
- Verify the key exists in both language files
- Check for typos in `data-i18n` attribute values
- Ensure nested keys use correct dot notation

### Language Not Switching
- Confirm `data-language` attribute matches language code
- Check that the language file exists
- Verify browser local storage isn't corrupted

## Pro Tips

1. **Always add fallback text** in HTML as default content
2. **Keep translation keys descriptive** but not too long
3. **Group related translations** in logical categories
4. **Test frequently** when adding new content
5. **Use consistent naming patterns** across your site

## Current Translation Categories

Your translation files already include these categories:
- `navigation` - Site navigation links
- `hero` - Hero section content
- `alert` - Important notices
- `evidence` - Clinical research content
- `quickActions` - Call-to-action buttons
- `footer` - Footer information
- `language` - Language switcher labels
- `common` - Commonly used words/phrases

You can edit these or add new categories as needed!