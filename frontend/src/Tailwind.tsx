import * as React from 'react';
import * as CONFIG from "./env.json";

interface Navigation {
  name: string,
  href: string
}

const navigation: Navigation[] = [];

interface Props {
  reservations: JSX.Element,
  reserve: JSX.Element
}

const Tailwind = ({reservations, reserve}: Props): JSX.Element => {
  return (
    <div className="relative bg-gray-800 overflow-hidden">
      <div className="hidden sm:block sm:absolute sm:inset-0" aria-hidden="true">
        <svg
          className="absolute bottom-0 right-0 transform translate-x-1/2 mb-48 text-gray-700 lg:top-0 lg:mt-28 lg:mb-0 xl:transform-none xl:translate-x-0"
          width={364}
          height={384}
          viewBox="0 0 364 384"
          fill="none"
        >
          <defs>
            <pattern
              id="eab71dd9-9d7a-47bd-8044-256344ee00d0"
              x={0}
              y={0}
              width={20}
              height={20}
              patternUnits="userSpaceOnUse"
            >
              <rect x={0} y={0} width={4} height={4} fill="currentColor" />
            </pattern>
          </defs>
          <rect width={364} height={384} fill="url(#eab71dd9-9d7a-47bd-8044-256344ee00d0)" />
        </svg>
      </div>
      <div className="relative pt-2 pb-16 sm:pb-24">
        <main className="mt-16 sm:mt-24">
          <div className="mx-auto max-w-7xl">
            <div className="lg:grid lg:grid-cols-12 lg:gap-8">
              <div className="px-4 sm:px-6 sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left lg:flex lg:items-center">
                <div>
                  <h1 className="mt-4 text-4xl tracking-tight font-extrabold text-white sm:mt-5 sm:leading-none lg:mt-6 lg:text-5xl xl:text-6xl">
                    <span className="md:block">ACME Company</span>{' '}
                    <span className="text-indigo-400 md:block">trustless booking system</span>
                  </h1>
                  <p className="mt-3 text-base text-gray-300 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                    Powered by Ethereums' Rinkeby testnet, ACME's booking system ensures your orders are secure and never lost. It's easy: connect your wallet, sign up, and start reserving your rooms!
                  </p>
                </div>
              </div>
              <div className="mt-16 sm:mt-24 lg:mt-0 lg:col-span-6">
                <div className="bg-white sm:max-w-md sm:w-full sm:mx-auto sm:rounded-lg sm:overflow-hidden">
                  <div className="px-4 py-8 sm:px-10">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Your reservations</p>

                      <div className="mt-1">
                        {reservations}
                      </div>
                    </div>

                    <div className="my-3 relative">
                      <div className="absolute inset-0 flex items-center" aria-hidden="true">
                        <div className="w-full border-t border-gray-300" />
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">Create Reservation</span>
                      </div>
                    </div>
                      {reserve}
                    </div>
                  <div className="px-4 py-6 bg-gray-50 border-t-2 border-gray-200 sm:px-10">
                    <p className="text-xs leading-5 text-gray-500">
                      By signing up, you agree to our ridiculous policies which you can't opt out of, ever, and are so scary you just shouldn't read them.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

const FAQ = ():JSX.Element => {

interface QuestionAnswer {
  question: string,
  answer: string
}

const faqs: QuestionAnswer[] = [
  {
    question: "How do I use the dapp?",
    answer:
      "Step 1: connect your wallet to the site. It'll connect to the Rinkeby Ethereum testnet. Step 2: Sign up by pressing the sign up button and sending a transaction through your wallet. Step 3: Select a room and date, then reserve with a transaction!.",
  },
  {
    question: "What if I don't have a wallet on Rinkeby?",
    answer:
      "No problem, here are two wallets with test ETH. Go to 'Import Accounts' and input these accounts and private keys. Wallet #1: {Address: 0x3d8AD929FD359cD44a8f95Da7A3cc6baF092ee3a, Key:882fd4716b637db987da4fe25418f5fc9110848448be7f7a5d1f1133b88cb71a}. Wallet #2: {Address:0x7fbe7B4853CaFF9C76fA346aBDbEbB37c8463187, Key:914c4a4033508efa9751313b4851009a4a6126166aa0565854248c253b464256}",
  },
  {
    question: "What if I don't have ETH on Rinkeby?",
    answer:
      "Visit https://faucet.rinkeby.io/ and follow this instructions to get testnet ETH.",
  },
  {
    question: "What tech stack was this built with?",
    answer:
      "Typescript, Node.js, React.js, and Solidity.",
  },
  {
    question: "Can you describe this project?",
    answer:
      "This is a demo project. It's a CRUD (Create, Read, Update, Delete) application with a twist: the data layer uses the Ethereum blockchain instead of a database or document store.",
  }
]
  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-20 lg:px-8">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900">Frequently asked questions</h2>
            <p className="mt-4 text-lg text-gray-500">
              You'll need a web3 compatible wallet such as {" "}
              <a href="https://metamask.io" className="font-medium text-indigo-600 hover:text-indigo-500">
                MetaMask
              </a>. The <a href={"https://rinkeby.etherscan.io/address/" + CONFIG.ADDRESS } className="font-medium text-indigo-600 hover:text-indigo-500">contract</a> is on Rinkeby testnet. The source code is <a href="https://github.com/rocketbrainsurgeon" className="font-medium text-indigo-600 hover:text-indigo-500">available on Github</a>.
            </p>
          </div>
          <div className="mt-12 lg:mt-0 lg:col-span-2">
            <dl className="space-y-12">
              {faqs.map((faq) => (
                <div key={faq.question}>
                  <dt className="text-lg leading-6 font-medium text-gray-900">{faq.question}</dt>
                  <dd className="mt-2 text-base text-gray-500">{faq.answer}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );

}

export { Tailwind, FAQ }