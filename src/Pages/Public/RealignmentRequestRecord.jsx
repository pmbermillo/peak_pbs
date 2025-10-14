import React from 'react'
import Table from '../../Component/Table'

const columns = [
    { 
        header: "Action", 
        accessor: "action", 
        renderCell: (_, row) => (
        <button
            onClick={() => alert(`Editing ${row.name}`)}
            className="px-2 py-1 text-xs bg-blue-500 text-white rounded-md"
        >
            Edit
        </button>
        )
    },
    { header: "Name", accessor: "name" },
    { 
        header: "Score", 
        accessor: "score", 
        renderCell: (value) => (
        <span className={value > 80 ? "text-green-600 font-bold" : "text-red-500"}>
            {value}
        </span>
        )
    },
    { header: "Email", accessor: "email" },
    { header: "Role", accessor: "role" },
];

const data = [
    { name: "Alice", age: 25, score: 92 },
    { name: "Bob", age: 30, score: 60 },
    { name: "Charlie", age: 22, score: 78 },
];

const RealignmentRequestRecord = () => {
  return (
    <div >
        <Table title="Re-alignment Request" columns={columns} data={data} />
    </div>
  )
}

export default RealignmentRequestRecord