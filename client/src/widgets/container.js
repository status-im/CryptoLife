import React from "react"
import PropTypes from "prop-types"

const Container = ({ children, xs, sm, md, lg, xl, className }) => (
    <div className={className ? className + " container" : "container"}>
        <style>
            {`
                ${xs ? `.container {
                    max-width: ${xs}px;
                    margin-left: auto;
                    margin-right: auto;
                    padding-left: 10px;
                    padding-right: 10px;
                }` : ""};
                @media (min-width: 576px) {
                    .container {
                        max-width: ${sm || (xs != Container.defaultProps.xs && xs) || 560}px;
                        padding-left: 0px;
                        padding-right: 0px;
                    }
                }
                @media (min-width: 768px) {
                    .container {
                        max-width: ${md || sm || (xs != Container.defaultProps.xs && xs) || 750}px;
                        padding-left: 0px;
                        padding-right: 0px;
                    }
                }
                @media (min-width: 992px) {
                    .container {
                        max-width: ${lg || md || sm || (xs != Container.defaultProps.xs && xs) || 920}px;
                        padding-left: 0px;
                        padding-right: 0px;
                    }
                }
                @media (min-width: 1200px) {
                    .container {
                        max-width: ${xl || lg || md || sm || (xs != Container.defaultProps.xs && xs) || 980}px;
                        padding-left: 0px;
                        padding-right: 0px;
                    }
                }
            `}
        </style>
        {children}
    </div>
)
Container.propTypes = {
    className: PropTypes.string,
    children: PropTypes.any,
    xs: PropTypes.number, // max width on XS
    sm: PropTypes.number, // ...
    md: PropTypes.number,
    lg: PropTypes.number,
    xl: PropTypes.number
}
Container.defaultProps = {
    xs: 560
}

export default Container
