import React, { useState } from "react";
import { X, ShoppingCart, Edit, Eye } from "lucide-react";
import BlogList from "./components/BlogList";
import BlogPostCreator from "./components/BlogPostCreator";
import TextToSpeech from "./components/TextToSpeech";

const App = () => {
  const [transcript, setTranscript] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const handlePostUpdated = () => {
    setRefreshKey((oldKey) => oldKey + 1);
  };
  const [loggedIn, setLoggedIn] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Product 1",
      price: 19.99,
      description: "This is product 1",
    },
    {
      id: 2,
      name: "Product 2",
      price: 29.99,
      description: "This is product 2",
    },
    {
      id: 3,
      name: "Product 3",
      price: 39.99,
      description: "This is product 3",
    },
  ]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === "admin" && password === "password") {
      setLoggedIn(true);
    } else {
      alert("Invalid credentials");
    }
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setShowPreview(false);
    setUsername("");
    setPassword("");
  };

  const handleProductEdit = (id, field, value) => {
    setProducts(
      products.map((product) =>
        product.id === id ? { ...product, [field]: value } : product
      )
    );
  };

  const LoginPage = () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="username"
            >
              Username
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="******************"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const Dashboard = () => (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between">
            <div className="flex space-x-7">
              <div className="flex items-center py-4">
                <span className="font-semibold text-gray-500 text-lg">
                  E-commerce Dashboard
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="py-2 px-2 font-medium text-gray-500 rounded hover:bg-blue-500 hover:text-white transition duration-300"
              >
                {showPreview ? <Edit size={24} /> : <Eye size={24} />}
              </button>
              <button
                onClick={handleLogout}
                className="py-2 px-2 font-medium text-white bg-blue-500 rounded hover:bg-blue-400 transition duration-300"
              >
                <X size={24} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold text-gray-900">Products</h2>
          <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
            {products.map((product) => (
              <div key={product.id} className="group relative">
                <div className="w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-80 lg:aspect-none">
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    <ShoppingCart size={48} />
                  </div>
                </div>
                <div className="mt-4 flex justify-between">
                  <div>
                    <input
                      className="text-sm text-gray-700 mb-2 w-full"
                      value={product.name}
                      onChange={(e) =>
                        handleProductEdit(product.id, "name", e.target.value)
                      }
                    />
                    <textarea
                      className="text-sm font-medium text-gray-900 w-full"
                      value={product.description}
                      onChange={(e) =>
                        handleProductEdit(
                          product.id,
                          "description",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    $
                    <input
                      className="w-16 text-right"
                      type="number"
                      value={product.price}
                      onChange={(e) =>
                        handleProductEdit(
                          product.id,
                          "price",
                          parseFloat(e.target.value)
                        )
                      }
                    />
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const PreviewShop = () => (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between">
            <div className="flex space-x-7">
              <div className="flex items-center py-4">
                <span className="font-semibold text-gray-500 text-lg">
                  Sample Shop
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowPreview(false)}
                className="py-2 px-2 font-medium text-gray-500 rounded hover:bg-blue-500 hover:text-white transition duration-300"
              >
                <Edit size={24} />
              </button>
              <button
                onClick={handleLogout}
                className="py-2 px-2 font-medium text-white bg-blue-500 rounded hover:bg-blue-400 transition duration-300"
              >
                <X size={24} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold text-gray-900">Our Products</h2>
          <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
            {products.map((product) => (
              <div key={product.id} className="group relative">
                <div className="w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-80 lg:aspect-none">
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    <ShoppingCart size={48} />
                  </div>
                </div>
                <div className="mt-4 flex justify-between">
                  <div>
                    <h3 className="text-sm text-gray-700">
                      <a href="#">
                        <span aria-hidden="true" className="absolute inset-0" />
                        {product.name}
                      </a>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {product.description}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    ${product.price.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Blog Post Voice Assistant</h1>
      <TextToSpeech setTranscript={setTranscript} />
      <BlogPostCreator
        initialContent={transcript}
        onPostAdded={handlePostUpdated}
      />
      <BlogList key={refreshKey} onPostUpdated={handlePostUpdated} />
      {/* <BlogList />
      <BlogPostCreator /> */}
      {/* <EditPostForm /> */}
      {/* {!loggedIn && <LoginPage />}
      {loggedIn && !showPreview && <Dashboard />}
      {loggedIn && showPreview && <PreviewShop />} */}
    </div>
  );
};

export default App;
