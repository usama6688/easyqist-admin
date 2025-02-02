import React from 'react';
import Pagination from 'react-bootstrap/Pagination';
import "./Pagination.css";

const PaginationComponent = ({ currentPage, totalPages, onPageChange }) => {
    const items = [];

    const createPaginationItems = () => {
        items?.push(
            <Pagination.Item
                className='arrowBtns me-3'
                key="prev"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage == 1}
            >
                Prev
            </Pagination.Item>
        );

        if (currentPage > 3) {
            items?.push(
                <Pagination.Item key={1} onClick={() => onPageChange(1)}>
                    1
                </Pagination.Item>
            );
            if (currentPage > 4) {
                items?.push(<Pagination.Ellipsis key="start-ellipsis" disabled />);
            }
        }

        const startPage = Math.max(currentPage - 2, 1);
        const endPage = Math.min(currentPage + 2, totalPages);

        for (let number = startPage; number <= endPage; number++) {
            items?.push(
                <Pagination.Item
                    key={number}
                    active={number == currentPage}
                    onClick={() => onPageChange(number)}
                >
                    {number}
                </Pagination.Item>
            );
        }

        if (currentPage < totalPages - 2) {
            if (currentPage < totalPages - 3) {
                items?.push(<Pagination.Ellipsis key="end-ellipsis" disabled />);
            }
            items?.push(
                <Pagination.Item key={totalPages} onClick={() => onPageChange(totalPages)}>
                    {totalPages}
                </Pagination.Item>
            );
        }

        items?.push(
            <Pagination.Item
                className='arrowBtns ms-3'
                key="next"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage == totalPages}
            >
                Next
            </Pagination.Item>
        );
    };

    createPaginationItems();

    return (
        <div className="mt-3">
            <Pagination>{items}</Pagination>
        </div>
    );
};

export default PaginationComponent;