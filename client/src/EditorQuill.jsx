import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import PropTypes from 'prop-types';

// Define the toolbar modules for the ReactQuill editor
const modules = {
  toolbar: [
    [{ font: [] }, { size: [] }], // Font and size options
    ["bold", "italic", "underline", "strike"], // Text formatting options
    [{ header: "1" }, { header: "2" }, "blockquote", "code-block"], // Heading and blockquote options
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ], // List and indentation options
    ["link", "image", "video", "formula"], // Link, image, video, and formula options
    ["clean"], // Clean formatting option
  ],
};

// Define the available formats for the ReactQuill editor
const formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "color",
];

const EditorQuill = ({ value, onChange} ) => {
  return (
    <ReactQuill
      value={value}
      onChange={onChange}
      formats={formats}
      modules={modules}
    />
  );
};

export default EditorQuill;

EditorQuill.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired
};
