"use client";

import { useState } from "react";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simular envío de formulario
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setName("");
      setEmail("");
      setMessage("");
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-[#101010] border border-white/10 p-8 rounded-2xl max-w-lg mx-auto">
      {success && (
        <div className="rounded-md bg-green-900/50 border border-green-500 p-4 text-sm text-green-200">
          ¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="contactName" className="block text-sm font-medium text-zinc-300">Nombre Completo</label>
        <input
          id="contactName"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="block w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-zinc-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
          placeholder="Juan Pérez"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="contactEmail" className="block text-sm font-medium text-zinc-300">Correo Electrónico</label>
        <input
          id="contactEmail"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="block w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-zinc-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
          placeholder="juan@example.com"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="contactMessage" className="block text-sm font-medium text-zinc-300">Mensaje</label>
        <textarea
          id="contactMessage"
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="block w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-zinc-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
          placeholder="Escribe tu mensaje aquí..."
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-primary hover:bg-red-700 text-white font-bold rounded-lg transition-colors disabled:opacity-50 shadow-lg shadow-primary/20"
      >
        {loading ? "Enviando..." : "ENVIAR MENSAJE"}
      </button>
    </form>
  );
}
