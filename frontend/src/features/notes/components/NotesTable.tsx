import React, { useState } from 'react';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableSortLabel from '@mui/material/TableSortLabel';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { Note } from '../../../types';
import { useAppDispatch } from '../../../app/hooks';
import { deleteOneNote, getAllNotes, getOneNote } from '../notesThunks';
import dayjs from 'dayjs';
import useConfirm from '../../../components/Dialogs/Confirm/useConfirm';

interface DataTableProps {
  data: Note[];
}

const DataTable: React.FC<DataTableProps> = ({ data }) => {
  const dispatch = useAppDispatch();
  const [sortedField, setSortedField] = useState<keyof Note | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const navigate = useNavigate();
  const { confirm } = useConfirm();

  const changeNote = async (id: string) => {
    await dispatch(getOneNote(id));
    navigate("/edit-note/" + id);
  };

  const deleteNote = async (id: string) => {
    if (
      await confirm(
        "Предупреждение",
        "Вы действительно хотите удалить заметку?"
      )
    ) {
      await dispatch(deleteOneNote(id));
      await dispatch(getAllNotes());
      navigate("/");
    }
  };

  const handleSort = (field: keyof Note) => {
    if (sortedField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortedField(field);
      setSortDirection("asc");
    }
  };

  const sortedData = [...data].sort((a, b) => {
    if (sortedField) {
      if (sortDirection === "asc") {
        return a[sortedField] < b[sortedField] ? -1 : 1;
      } else {
        return a[sortedField] > b[sortedField] ? -1 : 1;
      }
    }
    return 0;
  });

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <TableSortLabel
                active={sortedField === "title"}
                direction={sortDirection}
                onClick={() => handleSort("title")}
              >
                Title
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortedField === "description"}
                direction={sortDirection}
                onClick={() => handleSort("description")}
              >
                Description
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortedField === "createdAt"}
                direction={sortDirection}
                onClick={() => handleSort("createdAt")}
              >
                Created At
              </TableSortLabel>
            </TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedData.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.title}</TableCell>
              <TableCell>{item.description}</TableCell>
              <TableCell>
                {dayjs(item.updatedAt).format("HH:mm DD.MM.YYYY")}
              </TableCell>
              <TableCell>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => changeNote(item._id)}
                  size="small"
                  sx={{ mr: 2 }}
                >
                  Edit
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={() => deleteNote(item._id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DataTable;
