import { useNavigate, useLocation } from 'react-router-dom';

const Breadcrumb = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getBreadcrumbs = () => {
    const pathnames = location.pathname.split('/').filter(x => x);
    const breadcrumbs = [];

    if (pathnames.length > 0 && pathnames[0] === 'admin') {
      breadcrumbs.push({ name: 'Admin', path: '/admin' });
      
      if (pathnames.length > 1) {
        const section = pathnames[1];
        const sectionNames = {
          students: 'Student Management',
          teachers: 'Teacher Management',
          data: 'Data Management',
          emails: 'Email Management'
        };
        
        if (sectionNames[section]) {
          breadcrumbs.push({ 
            name: sectionNames[section], 
            path: `/admin/${section}` 
          });
        }
      }
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  if (breadcrumbs.length === 0) return null;

  return (
    <nav className="flex mb-4" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={breadcrumb.path} className="inline-flex items-center">
            {index > 0 && (
              <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
              </svg>
            )}
            <button
              onClick={() => navigate(breadcrumb.path)}
              className={`inline-flex items-center text-sm font-medium ${
                index === breadcrumbs.length - 1
                  ? 'text-gray-500 cursor-default'
                  : 'text-gray-700 hover:text-blue-600 cursor-pointer'
              }`}
            >
              {breadcrumb.name}
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb; 