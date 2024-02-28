import React, { useEffect } from "react";
import QuestionItem from "./QuestionItem";

function QuestionList({ questions, setQuestions }) {
  useEffect(() => {
    fetch('http://localhost:4000/questions')
      .then(resp => resp.json())
      .then(questions => setQuestions(questions))
  }, []);

  const handleDelete = (id) => {
    fetch(`http://localhost:4000/questions/${id}`, {
      method: 'DELETE'
    })
    .then(resp => {
      if (resp.ok) {
        setQuestions(prevQuestions => prevQuestions.filter(question => question.id !== id));
        console.log('Question deleted successfully');
      } else {
        throw new Error('Failed to delete question');
      }
    })
    .catch(error => {
      console.error('Error deleting question:', error);
    });
  };

  const handleCorrectAnswerChange = (id, correctIndex) => {
    fetch(`http://localhost:4000/questions/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ correctIndex })
    })
    .then(resp => {
      if (resp.ok) {
        setQuestions(prevQuestions => prevQuestions.map(question => {
          if (question.id === id) {
            return { ...question, correctIndex };
          }
          return question;
        }));
        console.log('Correct answer updated successfully');
      } else {
        throw new Error('Failed to update correct answer');
      }
    })
    .catch(error => {
      console.error('Error updating correct answer:', error);
    });
  };

  const allQuestions = questions.map(question => (
    <QuestionItem 
      key={question.id} 
      question={question} 
      onDelete={() => handleDelete(question.id)}
      onCorrectAnswerChange={(correctIndex) => handleCorrectAnswerChange(question.id, correctIndex)} 
    />
  ));

  return (
    <section>
      <h1>Quiz Questions</h1>
      <ul>{allQuestions}</ul>
    </section>
  );
}

export default QuestionList;