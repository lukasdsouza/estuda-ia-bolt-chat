
export async function sendMessageToN8N(message: string, sessionId: string): Promise<string> {
  try {
    const webhookUrl = import.meta.env.VITE_N8N_CHAT_WEBHOOK_URL
    
    if (!webhookUrl) {
      throw new Error('N8N webhook URL not configured')
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        sessionId
      })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data.reply || data.message || 'Resposta não encontrada'
  } catch (error) {
    console.error('Error communicating with n8n:', error)
    throw new Error('Erro ao comunicar com o serviço de IA. Tente novamente.')
  }
}
