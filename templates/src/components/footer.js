import React from 'react';

class Footer extends React.Component {
    render() {
        return (
            <footer>
                <h3 onClick={(event) => window.location.href = "https://web.telegram.org"}>+7-8352-20-12-09, telegram</h3>
                <h3 onClick={(event) => window.location.href = "http://sb.silant.com/accounts/login/"}>Мой Силант, 2025</h3>
            </footer>
        )
    }
}

export default Footer;