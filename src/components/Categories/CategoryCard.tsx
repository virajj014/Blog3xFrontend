import React from 'react'
import './CategoryCard.css'

interface Category {
    name: string;
    path: string;
    bgcolor: string;
}

const CategoryCard = (data: Category) => {
    const { name, bgcolor, path } = data
    return (
        <div className='categorycard'>
        <p style={{
            fontSize: "18px"
        }}>
            {name}
        </p>
    </div>
    )
}

export default CategoryCard