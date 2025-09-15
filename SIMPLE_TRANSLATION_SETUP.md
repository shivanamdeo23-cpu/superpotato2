# Quick Setup Guide for Simple Translations

## What I've Built for You

✅ **Translation Files Created**
- `client/translations/en.json` - English translations
- `client/translations/hi.json` - Hindi translations

✅ **Translation Scripts Ready**
- JavaScript loader for HTML pages
- React hooks for component-based usage

✅ **Demo Pages**
- Pure HTML demo: `client/demo-translation.html`
- React demo: Visit `/demo/simple-translations` in your app

✅ **Documentation**
- Complete guide: `TRANSLATION_GUIDE.md`

## How to Use It Right Now

### Option 1: View the Demo
1. **Open your website** in the browser
2. **Visit `/demo/simple-translations`** to see the React demo
3. **Or open `demo-translation.html`** for the HTML version
4. **Click the language buttons** to see translations change

### Option 2: Edit Translations
1. **Open `client/translations/en.json`** in your file editor
2. **Change any text** (for example, change "Early Detection Saves Lives" to "Prevention Saves Lives")
3. **Open `client/translations/hi.json`** and change the corresponding Hindi text
4. **Refresh the demo page** to see your changes

## Quick Translation Examples

### For HTML Files
Add `data-i18n` attributes to your HTML:
```html
<h1 data-i18n="hero.title">Early Detection Saves Lives</h1>
<button data-i18n="hero.riskAssessment">Take Risk Assessment</button>
```

### For React Components
Use the translation hook:
```jsx
import { useSimpleTranslations } from "@/hooks/use-simple-translations";

function MyComponent() {
  const { t } = useSimpleTranslations();
  
  return (
    <div>
      <h1>{t('hero.title', 'Early Detection Saves Lives')}</h1>
      <button>{t('hero.riskAssessment', 'Take Risk Assessment')}</button>
    </div>
  );
}
```

## Test Your Setup

1. **Visit the demo page**: Go to `/demo/simple-translations`
2. **Switch languages**: Click English/हिंदी buttons
3. **Check if translations work**: Text should change between languages
4. **Edit a translation**: Change something in the JSON files and refresh

## What You Have Now

### Two Translation Systems
1. **Your Original System**: Advanced React context (still works!)
2. **New Simple System**: Easy JSON files (what you requested!)

### Easy Editing Process
1. Find the text you want to translate
2. Open the appropriate JSON file (`en.json` or `hi.json`)
3. Edit the text
4. Save the file
5. Refresh your page

### Organized Translation Keys
Your translations are organized into categories:
- `navigation.*` - Menu items
- `hero.*` - Hero section text  
- `alert.*` - Important notices
- `evidence.*` - Research information
- `quickActions.*` - Action buttons
- `footer.*` - Footer content

## Next Steps (If You Want)

### Add More Languages
1. **Create new JSON file**: `client/translations/es.json` (for Spanish)
2. **Copy structure from English**: Keep the same keys, translate values
3. **Add language button**: `<button data-language="es">Español</button>`

### Use in Your Existing Pages
1. **Add translation script**: Include the simple translation loader
2. **Add data-i18n attributes**: To elements you want translated
3. **Add language switcher**: Buttons for changing languages

## Files You Can Edit

✏️ **`client/translations/en.json`** - English text
✏️ **`client/translations/hi.json`** - Hindi text  
📖 **`TRANSLATION_GUIDE.md`** - Detailed instructions
🎯 **`client/demo-translation.html`** - Simple HTML example

## Need Help?

- **Read the full guide**: `TRANSLATION_GUIDE.md` has everything
- **Check the demo**: `/demo/simple-translations` shows how it works
- **Look at examples**: Both HTML and React examples are provided

The system is ready to use! Try editing the JSON files and see your changes immediately.