import React, { useState } from "react";
import "./FAQs.css";

function FAQ() {
  const faqs = [
    {
      question: "How can I track my request?",
      answer: "You can track your request by entering the Request ID in the 'Track Request' page.",
    },
    {
      question: "What is the service response time?",
      answer: "Our agents usually respond within 24 hours of your request submission.",
    },
    {
      question: "Can I change my service request?",
      answer: "Yes, you can modify your request from the dashboard before it is marked 'In Progress'.",
    },
    {
      question: "Who can I contact for urgent support?",
      answer: "You can contact your assigned agent directly using their phone number or our support email.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faq-page">
      <h2 className="faq-title">Frequently Asked Questions</h2>
      <div className="faq-container">
        {faqs.map((faq, index) => (
          <div
            className={`faq-item ${openIndex === index ? "open" : ""}`}
            key={index}
            onClick={() => toggleFAQ(index)}
          >
            <div className="faq-question">
              {faq.question}
              <span className="faq-toggle">{openIndex === index ? "-" : "+"}</span>
            </div>
            {openIndex === index && <div className="faq-answer">{faq.answer}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default FAQ;
