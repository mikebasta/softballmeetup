import React from 'react';
import Link from 'gatsby-link';

const Header = ({ siteTitle }) => (
  <div
    style={{
      background: 'rebeccapurple',
      marginBottom: '1.45rem',
    }}
  >
    <div
      style={{
      	display: 'flex',
		  justifyContent: 'space-between',
		  alignItems: 'center',
        margin: '0 auto',
        maxWidth: 960,
        padding: '1.45rem 0',
      }}
    >
      <h1 style={{ margin: 0 }}>
        <Link
          to="/"
          style={{
            color: 'white',
            textDecoration: 'none',
          }}
        >
          {siteTitle}
        </Link>
      </h1>
		<Link
			to="/admin/"
			style={{
				color: 'white',
				textDecoration: 'none',
			}}
		>
			Sign in
		</Link>
    </div>
  </div>
);

export default Header;
