import React from 'react';

const Table = ({ list }) => {

    return (
        <div className="table">
            {list.map(item => 
                <div key={item.objectID} className="table-row">
                    <span>
                        <a href={item.url}>{item.title}</a>
                    </span>
                    <span>{item.author}</span>
                    <span>{item.num_comment}</span>
                    <span>{item.points}</span>
                </div>
            )}
        </div>
    );
}

export default Table;