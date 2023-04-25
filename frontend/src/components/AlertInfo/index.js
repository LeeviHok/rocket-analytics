import Alert from 'react-bootstrap/Alert';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';

function AlertInfo({children, ...props}) {
  return (
    <Alert variant="info" {...props}>
      <FontAwesomeIcon
        icon={faCircleInfo}
        size="xl"
        className="me-3"
      />
      {children}
    </Alert>
  );
}

export default AlertInfo;
