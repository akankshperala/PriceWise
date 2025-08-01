"use client"

import { FormEvent, Fragment, useState } from 'react'
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from '@headlessui/react'
import Image from 'next/image'
import { addUserEmailToProduct } from '@/lib/actions'

const Modal = ({ productId }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [email, setEmail] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    await addUserEmailToProduct(productId, email)

    setIsSubmitting(false)
    setEmail('')
    closeModal()
  }

  const openModal = () => setIsOpen(true)
  const closeModal = () => setIsOpen(false)

  return (
    <>
      <button type="button" className="btn bg-black text-white rounded-3xl p-2" onClick={openModal}>
        Track
      </button>

      <Transition appear show={isOpen} as={Fragment}>
  <Dialog as="div" className="relative z-50" onClose={closeModal}>
    <TransitionChild
      as={Fragment}
      enter="ease-out duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="ease-in duration-200"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      {/* Background overlay */}
      <div className="fixed inset-0 bg-black opacity-60" aria-hidden="true" />
    </TransitionChild>

    <div className="fixed inset-0 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all z-50">
                <div className="flex flex-col">
                  <div className="flex justify-between">
                    <div className="p-3 border border-gray-200 rounded-10">
                      <Image
                        src="/assets/icons/logo.svg"
                        alt="logo"
                        width={28}
                        height={28}
                      />
                    </div>

                    <Image
                      src="/assets/icons/x-close.svg"
                      alt="close"
                      width={24}
                      height={24}
                      className="cursor-pointer"
                      onClick={closeModal}
                    />
                  </div>

                  <h4 className="dialog-head_text">
                    Stay updated with product pricing alerts right in your inbox!
                  </h4>

                  <p className="text-sm text-gray-600 mt-2">
                    Never miss a bargain again with our timely alerts!
                  </p>
                </div>

                <form className="flex flex-col mt-5" onSubmit={handleSubmit}>
                  <label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <div className="dialog-input_container">
                    <Image
                      src="/assets/icons/mail.svg"
                      alt="mail"
                      width={18}
                      height={18}
                    />

                    <input
                      required
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="dialog-input"
                    />
                  </div>

                  <button type="submit" className="btn bg-black text-white rounded-3xl p-2" >
                    {isSubmitting ? 'Submitting...' : 'Track'}
                  </button>
                </form>
              </DialogPanel>
        </TransitionChild>
      </div>
    </div>
  </Dialog>
</Transition>

    </>
  )
}

export default Modal
