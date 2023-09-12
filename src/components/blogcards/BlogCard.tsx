import React, { useEffect, useState } from 'react'


interface Blog {
    name: string;
    path: string;
    bgcolor: string;
}


const BlogCard = (data: Blog) => {
    const { name , bgcolor} = data;
    

    return (
        <div style={{
            width: '300px',
            height: '400px',
            background: bgcolor,
            display: "flex",
            justifyContent: "center",
            alignItems  : "center",
        }}>
            <p style={{
                color: "white",
                fontSize: "15px"
            }}>
                {name}
            </p>
        </div>
    )
}

export default BlogCard