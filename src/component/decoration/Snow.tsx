import React from "react";
import "./css/Snow.scss"; // 컴파일된 CSS 파일을 임포트

function Snow() {
    return (
        <div className="snow-container">
            {Array.from({ length: 200 }).map((_, index) => (
                <div className="snow" key={index}></div>
            ))}
        </div>
    );
}

export default Snow;
