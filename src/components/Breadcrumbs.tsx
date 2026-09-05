import { useLocation, Link } from "react-router";

export default function Breadcrumbs() {
  const location = useLocation();

  const pathNames = location.pathname.split("/").filter((x) => x);
  if (pathNames.length === 0) return null;

  return (
    <nav className="flex items-center space-x-2 text-slate-400 mb-6 p-3 rounded-lg">
      <Link to="/" className="hover:text-white transition-colors">
        Home
      </Link>

      {pathNames.map((value, index) => {
        const to = `/${pathNames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathNames.length - 1;

        return (
          <div key={to} className="flex items-center space-x-2">
            <span className="text-slate-600">/</span>
            {isLast ? (
              <span className="text-blue-400 font-medium capitalize">
                {value.replace("-", " ")}
              </span>
            ) : (
              <Link
                to={to}
                className="hover:text-white transition-colors capitalize"
              >
                {value.replace("-", " ")}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
