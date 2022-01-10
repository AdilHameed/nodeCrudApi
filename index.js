const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5000;
app.use(bodyParser.json());

app.get("/student", (req, res) => {
  const allStudentData = loadStudentData();
  res.send(allStudentData);
});

app.get("/student/:id", (req, res) => {
  const id = req.params.id;
  const allStudentData = loadStudentData();
  const student = allStudentData.find((student) => student.id === Number(id));
  if (student) {
    res.send(student);
  } else {
    res.send(`No student found with id : ${id}`);
  }
});

app.post("/student", (req, res) => {
  const data = req.body;
  let allStudentData = loadStudentData();
  allStudentData = [...allStudentData, { id: allStudentData.length, ...data }];
  saveStudentData(allStudentData);
  const allStudentData1 = loadStudentData();
  res.send(allStudentData1);
});

app.put("/student/:id", (req, res) => {
  const id = Number(req.params.id);
  const allStudentData = loadStudentData();
  const checkStudent = allStudentData.some((student) => student.id === id);
  console.log(checkStudent);
  if (checkStudent) {
    const updatedStudentData = allStudentData.map((student) => {
      if (student.id === id) {
        if (req.body.name) {
          student.name = req.body.name;
        }
        if (req.body.class) {
          student.class = req.body.class;
        }
      }
      return student;
    });
    saveStudentData(updatedStudentData);
    const allStudentData1 = loadStudentData();
    res.send(allStudentData1);
  } else {
    res.send(`Student with id: ${id} doesn't exist`);
  }
});

app.delete("/student/:id", (req, res) => {
  const id = Number(req.params.id);
  const allStudentData = loadStudentData();
  const studentDeleted = allStudentData.filter((student) => student.id !== id);
  if (studentDeleted.length < allStudentData.length) {
    saveStudentData(studentDeleted);
    const allStudentData1 = loadStudentData();
    res.send(allStudentData1);
  } else {
    res.send(`Student with id: ${id} doesn't exist`);
  }
});

const loadStudentData = () => {
  const dataBuffer = fs.readFileSync("studentList.json", "utf8");
  const allStudentsData = JSON.parse(dataBuffer);
  if (allStudentsData) {
    return allStudentsData;
  } else {
    return [];
  }
};

const saveStudentData = (studentData) => {
  const dataJSON = JSON.stringify(studentData);
  fs.writeFileSync("studentList.json", dataJSON);
};

app.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}`);
});
