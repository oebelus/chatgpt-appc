import { Configuration, OpenAIApi } from 'openai';
import { useState, useEffect, useRef } from 'react';
import React from 'react'
import $ from 'jquery'
import { func } from 'prop-types';
import { openaiConfig } from './openaiConfig';

const Generate = () => {

    const configuration = new Configuration({
        apiKey: openaiConfig.apiKey
  })

    const openai = new OpenAIApi(configuration)

    const [prompt, setPrompt] = useState("")
    const [result, setResult] = useState("")
    const textAreaRef = useRef(null);
    const righRef = useRef(null)
    const [previousResponses, setPreviousResponses] = useState([])

    useEffect(() => {
        const textArea = $(textAreaRef.current);
        textArea.focus(function() { textArea.css("background", "#f2f2f2") });
        textArea.blur(function() {
          if (textArea[0].value === '') {
            textArea.css("background", "none")
          }
        });
      }, []);

    const handleClick = async () => {
        try{
            const response = await openai.createCompletion({
                model: 'text-davinci-003',
                prompt: prompt,
                max_tokens: 500,
                temperature: 0.1, // < 1 => more flexibility
                })
                const generatedText = response.data.choices[0].text;

                let i = 0;
                const timer = setInterval(() => {
                    setResult(generatedText.substring(0, i));
                    i++;

                if (i > generatedText.length) {
                    clearInterval(timer);
                        }
                    }, 50);
                setPreviousResponses(prevResponses => [...prevResponses, generatedText])
                }
                    
            catch(error) {
            console.log(error)
        }
    }
    

  return (
    <div className='type'>
            <div className="main">
                <div className="left">
                    <h2 className='answer'>Answer</h2>
                    <p onChange={setResult} className='result'>{result}</p>
                </div>
                <div className="right">
                    <h2 className='history'>History</h2>
                    <ul className='ulist' ref={righRef}>
                        {/* Render the list of previous responses */}
                        {previousResponses.map((response, index) => (
                        <li key={index}>{response}</li>
                        ))}
                    </ul>
                </div>
        </div>
        
        <div className="text">
            <textarea className='placeholder' placeholder="Type your prompt here..." ref={textAreaRef} onChange={(e) => setPrompt(e.target.value)} name="" id="" cols="30" rows="10"></textarea>
            <button onClick={handleClick} className='generate button-6'>Generate</button>
        </div>

        
    </div>
  )
}

export default Generate