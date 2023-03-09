import { NavLink } from 'react-router-dom';

function PageNotFound() {
  return (
    <div className="d-flex flex-column align-items-center">
      <div className="error" data-text="404">404</div>
      <p class="lead text-gray-800 mb-5">Page Not Found</p>
      <p class="text-gray-500 mb-0">It looks like you found a glitch in the matrix...</p>
      <NavLink to="/" className="underline-hover">&larr; Back to Dashboard</NavLink>
    </div>
  );
}

export default PageNotFound;
