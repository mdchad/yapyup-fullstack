import { Link } from "@tanstack/react-router";

export default function Header({
  isAuthenticated,
}: {
  isAuthenticated: boolean;
}) {
  return (
    <header className="p-2 flex gap-2 bg-white text-black justify-between">
      <nav className="flex flex-row">
        <div className="px-2">
          <Link to="/" className="[&.active]:font-bold">
            Home
          </Link>
        </div>

        {isAuthenticated ? (
          <>
            <div className="px-2">
              <Link to="/" className="[&.active]:font-bold">
                Dashboard
              </Link>
            </div>
            <div className="px-2">
              {/*<Link to="/chat" className="[&.active]:font-bold">*/}
              {/*  Chat*/}
              {/*</Link>*/}
            </div>
          </>
        ) : (
          <div className="px-2">
            <Link to="/auth/sign-in" className="[&.active]:font-bold">
              Log In
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
