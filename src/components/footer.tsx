export function Footer() {
  return (
    <footer className="bg-stone-200 rounded-t-lg shadow-sm dark:bg-gray-800   bottom-0 z-50">
      <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
        <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
          © {new Date().getFullYear()}{" "}
          <a href="/" className="hover:underline">
            Food Rank
          </a>
          
        </span>
        {/* <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
          <li>
            <p className="hover:underline me-4 md:me-6">About</p>
          </li>
          <li>
            <p className="hover:underline me-4 md:me-6">Privacy Policy</p>
          </li>
          <li>
            <p className="hover:underline me-4 md:me-6">Licensing</p>
          </li>
          <li>
            <p className="hover:underline">Contact</p>
          </li>
        </ul> */}
      </div>
    </footer>
  );
}
