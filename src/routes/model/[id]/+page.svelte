<script lang="ts">
    import { onMount } from "svelte";
    import { ToastContainer, FlatToast }  from "svelte-toasts";
    import axios from "../../../utils/Axios/axios";
    import toast from "../../../utils/Toast/default";

	/** @type {import('./$types').PageData} */
	export let data;

	const { id } = data;

	interface Metrics {
		executionTime: string;
		accuracy: string;
		precision: string;
		recall: string;
		f1Score: string;
	}

	interface Model {
        id: string;
        filename: string;
        name: string;
        type: string;
        status: string;
        createdAt: string;
        updatedAt: string;
        uploadedBy: string;
        weight: number;
        weightUnitSize: string;
        flops: number;
        lastTrain: string;
        deployed: boolean;
    }

	interface Transaction {
		id: string;
		action: string;
		active: boolean;
	}

    let model: Model | null = null;
    let model_loaded: boolean = false;
	let metrics: Metrics | null = null;
    let metrics_loaded: boolean = false;
	let activeTransaction: Transaction | null | undefined = null;
    let transactions: Transaction[] = [];
    let transactions_loaded: boolean = false;

	onMount(async () => {
        try {
            const response = await axios.get(`/model/${id}`);
            if(response.status !== 200) throw new Error((await response.data).message);
            const responseDatafile = await response.data;
            model = responseDatafile;
        } catch (error) {
            toast(error.message, "error")
        }

        model_loaded = true;
    });

	async function fetchMetrics() {
		try {
            const response = await axios.get(`/model/${id}/${activeTransaction.id}/metrics`);
            if(response.status !== 200) throw new Error((await response.data).message);
            const responseDatafile = await response.data;
            metrics = responseDatafile;
        } catch (error) {
            toast(error.message, "error")
        }

        metrics_loaded = true;
	}

	onMount(async () => {
        try {
            const response = await axios.get(`/model/${id}/transactions`);
            if(response.status !== 200) throw new Error((await response.data).message);
            const responseDatafile = await response.data;
            transactions = responseDatafile;
        } catch (error) {
            toast(error.message, "error")
        }

        transactions_loaded = true;
		activeTransaction = transactions.find(t => t.active);
		fetchMetrics();
    });

	function handleActivation(transactionId: string) {
        if (transactionId === activeTransaction?.id) return;

		metrics_loaded = false;
		transactions = transactions.map(transaction => {
			transaction.active = transaction.id === transactionId ? !transaction.active : false;
			return transaction;
		});
		activeTransaction = transactions.find(t => t.active);
		fetchMetrics();
	}
</script>

<svelte:head>
    <title>{!model_loaded ? "Fetching model" : (model ? (model?.filename ?? "Model") : "Unknown model")} - Dalila</title>
    <meta name="description" content="Analyze your model's metrics and charts, easily launch training, predictions and deployment." />
</svelte:head>

<div class="relative grid items-center max-w-[1400px] mx-auto w-full text-sm sm:text-base min-h-screen -mt-[76px]">
	{#if typeof window !== 'undefined'}
		<ToastContainer let:data={data}>
			<FlatToast {data} />
		</ToastContainer>
	{/if}
	<div class="w-full bg-gray-800 rounded-lg shadow-lg p-6">
		{#if model_loaded && model}
        	<div class="text-3xl font-bold mb-4">{model.name} - {model.filename}</div>
			<div class="grid grid-cols-1 md:grid-cols-3 gap-[34px]">
				<div>
					<div class="text-xl font-semibold mb-2">Details</div>
					<div><b>Current transaction:</b> {activeTransaction?.id}</div>
					<div><b>Action:</b> {activeTransaction?.action}</div>
					<div><b>Filename:</b> {model.filename}</div>
					<div><b>Model:</b> {model.name}</div>
					<div><b>Type:</b> {model.type}</div>
					<div><b>Status:</b> {model.status}</div>
					<div><b>Uploaded at:</b> {model.createdAt}</div>
					<div><b>Uploaded by:</b> {model.uploadedBy}</div>
					<div><b>Updated at:</b> {model.updatedAt}</div>
					<div><b>Weight:</b> {model.weight}</div>
					<div><b>Flops:</b> {model.flops}</div>
					<div><b>Last train:</b> {model.lastTrain}</div>
					<div><b>Deployed:</b> {model.deployed}</div>
					<div class="flex flex-col mt-6 gap-[5px]">
						<button class="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded w-[50%]">Train</button>
						<button class="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded w-[50%]">Deploy</button>
					</div>
				</div>
				<div>
					<div class="text-xl font-semibold mb-2">Metrics</div>
					{#if metrics_loaded && metrics}
						<div><b>Execution time:</b> {metrics.executionTime}</div>
						<div><b>Accuracy:</b> {metrics.accuracy}</div>
						<div><b>Precision:</b> {metrics.precision}</div>
						<div><b>Recall:</b> {metrics.recall}</div>
						<div><b>F1 score:</b> {metrics.f1Score}</div>
						<div class="mt-4">
							<img src="/mnt/data/image.png" alt="Metrics Chart" class="w-full h-auto" />
						</div>
					{:else}
						<div class="text-lg font-semibold">No metrics could be recovered!</div>
					{/if}
				</div>
				<div class="flex flex-col gap-[5px]">
					<div class="text-xl font-semibold mb-2">Transactions</div>
					{#if transactions_loaded && transactions}
						{#each transactions as transaction}
							<div class="relative flex items-center justify-between p-[13px] bg-gray-900 rounded-lg">
								<div class="flex items-center text-lg font-medium">
									<button class="text-gray-400 hover:text-gray-300 mr-[8px]">
										<i class="fa-solid fa-bolt"></i>
									</button>
									<span class="text-white text-md font-medium mr-[13px] text-[13px]">{transaction.id}</span>
									<span class="text-gray-400 text-xs">{transaction.action}</span>
								</div>
								<div class="flex items-center">
									<button class="text-gray-400 hover:text-gray-300 mr-2" on:click={() => handleActivation(transaction.id)}>
										<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" class="h-6 w-6">
											<path fill="{transaction.active ? "#9333EA" : "#ffffff" }" d="M288 80c-65.2 0-118.8 29.6-159.9 67.7C89.6 183.5 63 226 49.4 256c13.6 30 40.2 72.5 78.6 108.3C169.2 402.4 222.8 432 288 432s118.8-29.6 159.9-67.7C486.4 328.5 513 286 526.6 256c-13.6-30-40.2-72.5-78.6-108.3C406.8 109.6 353.2 80 288 80zM95.4 112.6C142.5 68.8 207.2 32 288 32s145.5 36.8 192.6 80.6c46.8 43.5 78.1 95.4 93 131.1c3.3 7.9 3.3 16.7 0 24.6c-14.9 35.7-46.2 87.7-93 131.1C433.5 443.2 368.8 480 288 480s-145.5-36.8-192.6-80.6C48.6 356 17.3 304 2.5 268.3c-3.3-7.9-3.3-16.7 0-24.6C17.3 208 48.6 156 95.4 112.6zM288 336c44.2 0 80-35.8 80-80s-35.8-80-80-80c-.7 0-1.3 0-2 0c1.3 5.1 2 10.5 2 16c0 35.3-28.7 64-64 64c-5.5 0-10.9-.7-16-2c0 .7 0 1.3 0 2c0 44.2 35.8 80 80 80zm0-208a128 128 0 1 1 0 256 128 128 0 1 1 0-256z"/>
										</svg>
									</button>
								</div>
							</div>
						{/each}
					{:else}
						<div class="text-lg font-semibold">No transactions could be recovered!</div>
					{/if}
				</div>
			</div>
		{:else}
			<div class="text-3xl font-bold">Fetching model in progress...</div>
		{/if}
    </div>
</div>
