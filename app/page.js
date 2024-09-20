'use client'

import { useState, useEffect, useRef } from 'react'
import { Button, Textarea, Input } from '@nextui-org/react'
import { MessageSquare, RefreshCcw, Moon, Sun, Send, Layout, Lock, BarChart, Users, Trash2, Copy, User, Bot } from 'lucide-react'
import Link from 'next/link'

// Contact component
const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: '3079ea33-eb0a-4c36-964c-fdb75b8500ce', // replace with your access key
          name: formData.name,
          email: formData.email,
          message: formData.message,
        }),
      });

      if (response.ok) {
        setSubmitMessage('Message sent successfully!');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setSubmitMessage('Failed to send message. Please try again.');
      }
    } catch (error) {
      setSubmitMessage('An error occurred. Please try again later.');
    }

    setIsSubmitting(false);
  };

  return (
    <div className="max-w-xl mx-auto backdrop-blur-lg bg-white/40 dark:bg-gray-800/40 p-6 rounded-lg shadow-lg border border-white/20 dark:border-gray-700">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Input
            placeholder="Your Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full bg-transparent border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 dark:bg-gray-800"
            required
          />
        </div>
        <div className="mb-4">
          <Input
            type="email"
            placeholder="Your Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full bg-transparent border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 dark:bg-gray-800"
            required
          />
        </div>
        <div className="mb-4">
          <Textarea
            placeholder="Your Message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            minRows={3}
            className="w-full bg-transparent border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 dark:bg-gray-800"
            required
          />
        </div>
        <Button
          type="submit"
          color="primary"
          endContent={<Send size={16} />}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </Button>
      </form>
      {submitMessage && (
        <p
          className={`mt-4 text-center ${
            submitMessage.includes('successfully') ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {submitMessage}
        </p>
      )}
    </div>
  );
};

export default function Home() {
  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    document.body.className = darkMode ? 'dark' : ''
  }, [darkMode])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleAsk = async () => {
    if (!question.trim()) return
    const userMessage = { sender: 'user', text: question }
    setMessages([...messages, userMessage])
    setQuestion('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userMessage.text })
      })
      const data = await response.json()
      const aiMessage = { sender: 'ai', text: data.answer }
      setMessages([...messages, userMessage, aiMessage])
    } catch (error) {
      console.error('Error:', error)
      const errorMessage = { sender: 'ai', text: 'Something went wrong. Please try again later.' }
      setMessages([...messages, userMessage, errorMessage])
    }

    setIsLoading(false)
  }

  const handleReset = () => {
    setMessages([])
    setQuestion('')
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className={`min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors`}>
      {/* Compact Header */}
      <header className="mx-auto w-full max-w-4xl backdrop-blur-md bg-white/30 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700 shadow-lg rounded-xl">
        <div className="container flex justify-between items-center py-3 px-4">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center">
              <span className="ml-2 text-xl font-semibold">Quran GPT</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="p-2"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? <Sun size={24} /> : <Moon size={24} />}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Chat Container */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="backdrop-blur-md bg-white/30 dark:bg-gray-800/30 shadow-xl rounded-xl p-6 border border-white/20 dark:border-gray-700">
          <h1 className="text-4xl font-bold text-center mb-4">Quran GPT</h1>
          <p className="text-center mb-8 text-gray-700 dark:text-gray-300">
            AI-powered Islamic knowledge base providing answers based on the Holy Quran.
          </p>

          {/* Chat Container */}
          <div className="relative h-[400px] overflow-y-auto p-4 mb-4 rounded-lg bg-white/40 dark:bg-gray-800/40 backdrop-blur-lg shadow-inner border border-white/20 dark:border-gray-700">
            {messages.length === 0 && (
              <p className="text-center text-gray-500 dark:text-gray-400">Ask a question to start the conversation.</p>
            )}
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs p-3 my-2 rounded-lg ${message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100'} shadow-md`}>
                  {message.sender === 'user' ? <User className="inline-block mr-2" size={16} /> : <Bot className="inline-block mr-2" size={16} />}
                  {message.text.replace(/<[^>]*>?/gm, '')}
                  {message.sender === 'ai' && (
                    <Button
                      size="sm"
                      variant="light"
                      className="ml-2"
                      onClick={() => copyToClipboard(message.text.replace(/<[^>]*>?/gm, ''))}
                    >
                      <Copy size={16} />
                    </Button>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            <Textarea
              placeholder="Ask your question..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              minRows={1}
              className="flex-grow rounded-md dark:bg-gray-800 dark:border-gray-600"
            />
            <Button
              color="primary"
              endContent={<MessageSquare />}
              onClick={handleAsk}
              disabled={isLoading}
            >
              {isLoading ? 'Asking...' : 'Ask'}
            </Button>
            <Button
              color="secondary"
              endContent={<Trash2 />}
              onClick={handleReset}
            >
              Clear Chat
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <section className="py-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold">Features</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Discover what makes Quran GPT unique and valuable.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Layout, title: "User-friendly Design", description: "Intuitive interface for ease of use." },
              { icon: Lock, title: "Secure Information", description: "Your data is encrypted and safe." },
              { icon: BarChart, title: "Comprehensive Knowledge", description: "Covers a wide range of topics and queries." },
              { icon: Users, title: "Community Driven", description: "Feedback from the community helps improve the answers." },
            ].map((feature, index) => (
              <div key={index} className="flex flex-col items-center text-center backdrop-blur-lg bg-white/40 dark:bg-gray-800/40 p-6 rounded-lg shadow-lg border border-white/20 dark:border-gray-700">
                <feature.icon className="h-12 w-12 text-blue-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-700 dark:text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="py-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold">Contact Us</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Have any questions or feedback? Get in touch with us!
            </p>
          </div>
          <Contact />
        </section>
      </main>

      {/* Compact Footer */}
      <footer className="mx-auto w-full max-w-4xl backdrop-blur-md bg-white/30 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700 shadow-lg rounded-xl py-4 text-center mt-8">
        <div className="container px-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Made with ❤️ by{' '}
            <Link
              href="https://www.linkedin.com/in/menajul-hoque/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Menajul Hoque
            </Link>
          </p>
        </div>
      </footer>
    </div>
  )
}
