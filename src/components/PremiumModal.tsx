'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { X, Check, Crown, Zap, Shield, Star } from 'lucide-react'

interface PremiumModalProps {
  isOpen: boolean
  onClose: () => void
  evaluationId: string
}

export default function PremiumModal({ isOpen, onClose, evaluationId }: PremiumModalProps) {
  const router = useRouter()

  if (!isOpen) return null

  const handleUpgrade = () => {
    router.push(`/payment/${evaluationId}`)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-2xl p-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200"
          >
            <X className="h-6 w-6" />
          </button>
          <div className="text-center">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Crown className="h-8 w-8 text-yellow-300" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Unlock Premium Analysis</h2>
            <p className="text-blue-100">Get the complete detailed report</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="text-3xl font-bold text-gray-900 mb-1">$4.99</div>
            <div className="text-gray-500">One-time payment</div>
          </div>

          {/* Features */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <Check className="h-5 w-5 text-green-600" />
              </div>
              <span className="text-gray-700">Complete detailed code analysis</span>
            </div>
            
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <Shield className="h-5 w-5 text-blue-600" />
              </div>
              <span className="text-gray-700">Security vulnerability assessment</span>
            </div>
            
            <div className="flex items-center">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                <Zap className="h-5 w-5 text-purple-600" />
              </div>
              <span className="text-gray-700">Performance optimization tips</span>
            </div>
            
            <div className="flex items-center">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                <Star className="h-5 w-5 text-yellow-600" />
              </div>
              <span className="text-gray-700">Personalized learning recommendations</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleUpgrade}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
            >
              Unlock Premium Report
            </button>
            
            <button
              onClick={onClose}
              className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-medium hover:bg-gray-200 transition-colors"
            >
              Maybe Later
            </button>
          </div>

          <p className="text-xs text-gray-500 text-center mt-4">
            Secure payment • Instant access • No subscription
          </p>
        </div>
      </div>
    </div>
  )
}