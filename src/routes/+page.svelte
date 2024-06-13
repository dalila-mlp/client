<script lang="ts">
    import { onMount } from "svelte";
    import { ToastContainer, FlatToast }  from "svelte-toasts";
    import UploadedItem from "../components/upload/UploadedItem.svelte";
    import toast from "../utils/Toast/default";

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

    let models: Model[] = [];
    let models_loaded: boolean = false;

    onMount(async () => {
        try {
            const response = await fetch('http://localhost/models');
            if (!response.ok) {
                throw new Error((await response.json()).message);
            }

            const responseDatafile = await response.json();
            models = responseDatafile;
        } catch (error) {
            toast(error.message, "error")
        }

        models_loaded = true;
    });

    interface Datafile {
        id: string;
        filename: string;
        createdAt: string;
        updatedAt: string;
        weight: number;
        weightUnitSize: string;
    }

    let datafiles: Datafile[] = [];
    let datafiles_loaded: boolean = false;

    onMount(async () => {
        try {
            const response = await fetch('http://localhost/datafiles');

            if (!response.ok) {
                throw new Error((await response.json()).message);
            }

            const responseDatafile = await response.json();
            datafiles = responseDatafile;
        } catch (error) {
            toast(error.message, 'error');
        }

        datafiles_loaded = true;
    });

    async function removeModel(id: string) {
        try {
            const response = await fetch(
                `http://localhost/model/${id}/delete`,
                {method: 'DELETE'},
            );

            if (!response.ok) {
                throw new Error((await response.json()).message);
            }

            models = models.filter((model) => model.id !== id);
        } catch (error) {
            toast(error.message, 'error');
        }
    }

    async function removeDatafile(id: string) {
        try {
            const response = await fetch(
                `http://localhost/datafile/${id}/delete`,
                {method: 'DELETE'},
            );

            if (!response.ok) {
                throw new Error((await response.json()).message);
            }

            datafiles = datafiles.filter((datafile) => datafile.id !== id);
        } catch (error) {
            toast(error.message, 'error');
        }
    }
</script>

<div class="relative grid items-center max-w-[1400px] mx-auto w-full text-sm sm:text-base min-h-screen -mt-[76px]">
    {#if typeof window !== 'undefined'}
        <ToastContainer let:data={data}>
            <FlatToast {data} />
        </ToastContainer>
    {/if}
    <div class="flex flex-col items-center justify-self-center w-full bg-[#15223C] rounded-3xl py-[34px] h-[75vh]">
        <div class="flex items-start justify-between w-full px-[34px] gap-[55px]">
            <div class="w-1/2">
                <div class="flex items-center justify-between w-full">
                    <div class="font-medium text-3xl">Models uploaded</div>
                    <a href="/upload_model">
                        <svg class="w-[26px] h-[26px] text-white" viewBox="0 0 448 512">
                            <path fill="#ffffff" d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/>
                        </svg>
                    </a>
                </div>
                {#if models.length && models_loaded}
                    <div class="relative flex flex-col gap-[13px] mt-[21px] max-h-[calc(75vh-6rem)] overflow-auto pr-[21px]">
                        {#each models as model (model.id)}
                            <UploadedItem {...model} eye={true} on:remove={() => removeModel(model.id)} />
                        {/each}
                    </div>
                {:else if !models_loaded}
                    <div>Loading models in progress...</div>
                {:else}
                    <div>No models found</div>
                {/if}
            </div>
            <div class="w-1/2">
                <div class="flex items-center justify-between w-full">
                    <div class="font-medium text-3xl">Datafiles uploaded</div>
                    <a href="/upload_data">
                        <svg class="w-[26px] h-[26px] text-white" viewBox="0 0 448 512">
                            <path fill="#ffffff" d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/>
                        </svg>
                    </a>
                </div>
                {#if datafiles && datafiles_loaded}
                    <div class="relative flex flex-col gap-[13px] mt-[21px] max-h-[calc(75vh-6rem)] overflow-auto pr-[21px]">
                        {#each datafiles as datafile (datafile.id)}
                            <UploadedItem {...datafile} eye={false} on:remove={() => removeDatafile(datafile.id)} />
                        {/each}
                    </div>
                {:else if !datafiles_loaded}
                    <div>Loading datafiles in progress...</div>
                {:else}
                    <div>No datafiles found</div>
                {/if}
            </div>
        </div>
    </div>
</div>

<style>
    ::-webkit-scrollbar {
        width: 12px; /* largeur de la scrollbar */
    }

    ::-webkit-scrollbar-track {
        background: #1e293b; /* couleur de l'arrière-plan de la scrollbar */
    }

    ::-webkit-scrollbar-thumb {
        background-color: #64748b; /* couleur de la poignée de la scrollbar */
        border-radius: 20px; /* arrondi des angles de la poignée de la scrollbar */
        border: 3px solid #1e293b; /* bordure et couleur séparant la poignée de la track */
    }
</style>
