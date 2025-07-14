import { describe, test, expect } from 'vitest';

// Test yang paling dasar - hanya memastikan file App.jsx bisa di-import
describe('App Component', () => {
  test('App module can be imported', async () => {
    const App = await import('./App');
    expect(App.default).toBeDefined();
    expect(typeof App.default).toBe('function');
  });

  test('App is a valid React component', async () => {
    const App = await import('./App');
    // Memastikan App adalah function (React component)
    expect(typeof App.default).toBe('function');
    // Memastikan nama component benar
    expect(App.default.name).toBe('App');
  });
});