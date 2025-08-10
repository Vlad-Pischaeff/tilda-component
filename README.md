# Tilda Component

A React component for embedding Tilda pages directly into your React application using the Tilda API.

## Features

- 🚀 Easy integration with Tilda CMS
- 🎨 Preserves original Tilda styling and functionality
- 📱 Responsive design support
- 🔧 TypeScript support
- ⚡ Lightweight and performant
- 🎯 Zero configuration setup

## Installation

```bash
npm install tilda-component
```

## Quick Start

```tsx
import React from 'react';
import { TildaComponent } from 'tilda-component';

function App() {
  const tildaData = {
    css: [
      "https://static.tildacdn.com/css/tilda-grid-3.0.min.css"
    ],
    js: [
      "https://static.tildacdn.com/js/tilda-polyfill-1.0.min.js"
    ],
    promoBlockId: 36499575,
    content: "<!--allrecords-->..."
  };

  return (
    <div>
      <TildaComponent data={tildaData} />
    </div>
  );
}

export default App;
```

## API Reference

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `data` | `Tilda` | Yes | - | Tilda page data with content, styles and scripts |
| `className` | `string` | No | - | Additional CSS class for the container |
| `onLoad` | `() => void` | No | - | Callback fired when the page is loaded |
| `onError` | `(error: ErrorEvent) => void` | No | - | Callback fired when an error occurs |

### Types

```tsx
export type Tilda = {
  css: string[];
  js: string[];
  promoBlockId: number;
  content: string;
};
```

## Usage Examples

### Basic Usage

```tsx
import { TildaComponent } from 'tilda-component';

// Transform Tilda API response to component format
const transformTildaData = (apiResponse) => {
  return {
    css: apiResponse.result.css,
    js: apiResponse.result.js,
    promoBlockId: parseInt(apiResponse.result.id),
    content: apiResponse.result.html
  };
};

// Fetch data from Tilda API
const fetchTildaPage = async (pageId: string) => {
  const response = await fetch(`https://api.tildacdn.com/v1/getpage/?publickey=${PUBLIC_KEY}&secretkey=${SECRET_KEY}&pageid=${pageId}`);
  const apiData = await response.json();
  return transformTildaData(apiData);
};

function MyPage() {
  const [tildaData, setTildaData] = useState(null);

  useEffect(() => {
    fetchTildaPage('36499575').then(setTildaData);
  }, []);

  if (!tildaData) return <div>Loading...</div>;

  return <TildaComponent data={tildaData} />;
}
```

### With Error Handling

```tsx
function MyPageWithErrorHandling() {
  const [tildaData, setTildaData] = useState(null);
  const [error, setError] = useState(null);

  const transformTildaData = (apiResponse) => ({
    css: apiResponse.result.css,
    js: apiResponse.result.js,
    promoBlockId: parseInt(apiResponse.result.id),
    content: apiResponse.result.html
  });

  const handleError = (err: ErrorEvent) => {
    console.error('Tilda component error:', err);
    setError(err.message);
  };

  const handleLoad = () => {
    console.log('Tilda page loaded successfully');
  };

  return (
    <div>
      {error && <div className="error">Error: {error}</div>}
      {tildaData && (
        <TildaComponent 
          data={tildaData}
          onLoad={handleLoad}
          onError={handleError}
          className="my-tilda-container"
        />
      )}
    </div>
  );
}
```

### Custom Styling

```tsx
function StyledTildaPage() {
  return (
    <TildaComponent 
      data={tildaData}
      className="custom-tilda"
    />
  );
}
```

## Tilda API Integration

To get the data in the required format, you'll need to use the Tilda API:

### Getting API Keys

1. Go to [Tilda.cc](https://tilda.cc)
2. Navigate to Site Settings → Export
3. Get your Public and Secret keys

### API Endpoint

```
GET https://api.tildacdn.com/v1/getpage/
```

### Parameters

- `publickey` - Your public API key
- `secretkey` - Your secret API key  
- `pageid` - ID of the page to retrieve

### Example API Call

```javascript
const PUBLIC_KEY = 'your_public_key';
const SECRET_KEY = 'your_secret_key';
const PAGE_ID = '36499575';

const response = await fetch(
  `https://api.tildacdn.com/v1/getpage/?publickey=${PUBLIC_KEY}&secretkey=${SECRET_KEY}&pageid=${PAGE_ID}`
);

const apiResponse = await response.json();

// Transform API response to component format
const tildaData = {
  css: apiResponse.result.css,
  js: apiResponse.result.js,
  promoBlockId: parseInt(apiResponse.result.id),
  content: apiResponse.result.html
};

// Use with TildaComponent
<TildaComponent data={tildaData} />
```

## Server-Side Rendering (SSR)

The component is compatible with SSR frameworks like Next.js:

```tsx
// pages/tilda-page.tsx
import { GetServerSideProps } from 'next';
import { TildaComponent, Tilda } from 'tilda-component';

interface Props {
  tildaData: Tilda;
}

export default function TildaPage({ tildaData }: Props) {
  return <TildaComponent data={tildaData} />;
}

export const getServerSideProps: GetServerSideProps = async () => {
  const response = await fetch(/* your Tilda API call */);
  const apiResponse = await response.json();
  
  const tildaData: Tilda = {
    css: apiResponse.result.css,
    js: apiResponse.result.js,
    promoBlockId: parseInt(apiResponse.result.id),
    content: apiResponse.result.html
  };

  return {
    props: { tildaData }
  };
};
```

## Environment Variables

For security, store your API keys in environment variables:

```bash
# .env.local
TILDA_PUBLIC_KEY=your_public_key
TILDA_SECRET_KEY=your_secret_key
```

```javascript
const PUBLIC_KEY = process.env.TILDA_PUBLIC_KEY;
const SECRET_KEY = process.env.TILDA_SECRET_KEY;
```

## Troubleshooting

### Common Issues

**Page not loading**
- Verify your API keys are correct
- Check that the page ID exists and is published
- Ensure CORS is properly configured if calling from browser

**Styling issues**
- Tilda CSS should load automatically from the `css` array
- Check browser console for any failed resource loads
- Verify no conflicting CSS rules in your application

**JavaScript not working**
- Tilda JS should load automatically from the `js` array
- Some Tilda widgets require specific initialization
- Check browser console for JavaScript errors

### Debug Mode

Enable debug logging:

```tsx
<TildaComponent 
  data={tildaData}
  onLoad={() => console.log('Loaded!')}
  onError={(err) => console.error('Error:', err)}
/>
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -am 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Submit a pull request

## Development

```bash
# Clone the repository
git clone https://github.com/Vlad-Pischaeff/tilda-component.git

# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test

# Build for production
npm run build

# Run linting
npm run lint
```

## License

MIT © [Vlad-Pischaeff](https://github.com/Vlad-Pischaeff)

## Links

- [Tilda.cc](https://tilda.cc) - Website builder
- [Tilda API Documentation](https://help.tilda.cc/api) - Official API docs
- [GitHub Repository](https://github.com/Vlad-Pischaeff/tilda-component)

---

Made with ❤️ for the React community

