export default function ColorTest() {
  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">Color Test</h2>

      <div className="space-y-2">
        <h3 className="font-medium">Primary Colors</h3>
        <div className="flex space-x-2">
          {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
            <div key={shade} className="flex flex-col items-center">
              <div
                className={`w-10 h-10 bg-primary-${shade} rounded-md shadow`}
              ></div>
              <span className="text-xs mt-1">{shade}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-medium">Accent Colors</h3>
        <div className="flex space-x-2">
          {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
            <div key={shade} className="flex flex-col items-center">
              <div
                className={`w-10 h-10 bg-accent-${shade} rounded-md shadow`}
              ></div>
              <span className="text-xs mt-1">{shade}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <h3 className="font-medium">Text Colors</h3>
        <p className="text-primary-600">This text is in primary-600</p>
        <p className="text-primary-800">This text is in primary-800</p>
        <p className="text-accent-500">This text is in accent-500</p>
        <p className="text-neutral-600">This text is in neutral-600</p>
      </div>

      <div className="mt-6">
        <h3 className="font-medium">Gradient Button</h3>
        <button className="mt-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary-600 to-accent-500 text-white">
          Test Gradient Button
        </button>
      </div>
    </div>
  );
}
